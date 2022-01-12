#!/usr/bin/env python3

import io
import re
import json
import sys

# list of dependencies listed in package.json
package_json_deps = list(json.loads(open("package.json").read())["dependencies"].keys())

regex_safe_deps = map(lambda x: re.escape(x), package_json_deps)
regex_safe_deps = list(regex_safe_deps)


def is_full_import(line):
    if "import" in line and "from" in line:
        return True
    return False


def get_prefix(line):
    # Get string within quotes
    match = re.search(r'[\'"](.+)[\'"]', line)

    if match:
        text = match.groups()[0]

        # if prefix is within package.json, don't alter it
        for package_json_re in regex_safe_deps:
            if re.match(package_json_re, text):
                return text

        prefixes = text.split("/")
        filter_fn = lambda prefix: "." not in prefix
        return list(filter(filter_fn, prefixes))[0]
    return "n/a"


def sort_prefixes(prefixes: list[str]):
    sorted_prefixes = []

    for prefix_re in regex_safe_deps:
        filter_fn = lambda prefix: prefix not in sorted_prefixes and re.match(
            prefix_re, prefix
        )

        matches = sorted(list(filter(filter_fn, prefixes)))

        for prefix in matches:
            sorted_prefixes.append(prefix)
            prefixes.remove(prefix)

    # place react & react-native at top of imports
    for _, r in enumerate(["react-native", "react"]):
        if r in sorted_prefixes:
            sorted_prefixes.insert(0, sorted_prefixes.pop(sorted_prefixes.index(r)))

    if "react-native" in sorted_prefixes:
        sorted_prefixes.insert(sorted_prefixes.index("react-native") + 1, "\n")
    elif "react" in sorted_prefixes:
        sorted_prefixes.insert(sorted_prefixes.index("react") + 1, "\n")

    # add new line after package.json imports
    sorted_prefixes.append("\n")

    # add new line between every local import
    prefixes = ",\n,".join(sorted(prefixes)).split(",")

    concatted_prefixes = sorted_prefixes + prefixes

    return concatted_prefixes


def format_file(file_name):
    data = []
    rest_of_file = []
    prefixes = []

    with open(file_name) as file:
        buffer = io.StringIO()
        lines = file.readlines()


        # figure out how many lines contain imports
        import_slice = {'start': -1, 'end': -1}
        isImport = False
        for idx, line in enumerate(lines):
            if 'import' in line: 
                isImport = True
                if import_slice['start'] == -1: 
                    import_slice['start'] = idx
            
            if is_full_import(line): 
                import_slice["end"] = idx
                isImport = False

        _import = {"content": ""}
        isImport = False
        for idx, line in enumerate(lines):
            if 'import' in line:
                isImport = True

            if not isImport: 
                if idx > import_slice["end"]:
                    rest_of_file.append(line)
                continue
            
            # if one-line statement, remove newline character
            _import["content"] += line if not is_full_import(line) else line.replace('\n', '') 
            if is_full_import(_import["content"]):
                prefix = get_prefix(line)
                _import["prefix"] = get_prefix(line)

                if prefix not in prefixes:
                    prefixes.append(prefix)

                data.append(_import)
                isImport = False
                _import = {"content": ""}

        prefixes = sort_prefixes(prefixes)

        # find package.json block not including react + react-native, then sort it
        start_prefix = -1
        end_prefix = -1
        for i, prefix in enumerate(prefixes):
            if prefix not in ['react', 'react-native']:
                if prefix in package_json_deps and start_prefix == -1:
                    start_prefix = i
                elif prefix in package_json_deps and start_prefix != -1:
                    end_prefix = i + 1

        package_json_imports_in_file = prefixes[start_prefix:end_prefix]

        # Group all package.json imports together by adding group flag
        for i, line in enumerate(data):
            if line['prefix'] in package_json_imports_in_file:
                data[i]['prefix'] = 'package.json'

        prefixes = prefixes[0:start_prefix] + prefixes[end_prefix + 1:len(prefixes)]
        prefixes.insert(3, 'package.json')
        prefixes.insert(4, '\n')

        for i, prefix in enumerate(prefixes):
            if prefix == "\n":
                # add newline between each section
                buffer.write("\n")
                
                # add comment above each import block unless mentioned in package.json
                if prefixes[i+1] not in package_json_deps and prefixes[i+1] != 'package.json':
                    buffer.write("// " + prefixes[i + 1] + '\n')
                continue

            # grab all lines with prefix
            filter_fn = lambda imp: imp["prefix"] == prefix
            filtered_lines = list(filter(filter_fn, data))

            # remove trailing newlines
            for i, _ in enumerate(filtered_lines):
                filtered_lines[i]['content'] = filtered_lines[i]['content'].strip()
                    
            # Sort imports in each block
            filtered_lines.sort(key=lambda d: d['content'])

            for line in filtered_lines:
                buffer.write(line["content"] + '\n')

        for line in rest_of_file:
            buffer.write(line)

        text = buffer.getvalue()
        return text



import glob

if __name__ == "__main__":
    
    if len(sys.argv) < 2:
        print('Usage: ')
        print('  ' + sys.argv[0] + ' [path to file]')
        exit()

    fname = sys.argv[1]

    # files = []

    # for dir in ['components', 'screens']:
    #     files += glob.glob(fname + '/' + dir + '/**/*.tsx', recursive=True)

    # print(files)
    # exit()

    formatted_file = format_file(fname)
    with open(fname, 'w+') as file:
        file.write(formatted_file)
