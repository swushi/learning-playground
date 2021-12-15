#!/bin/bash

if test -z "$1" -o -z "$2"; then 
    echo "USAGE: substring.sh [string to find] [string to look in] [-v | --verbose]"
    exit 1
fi

test "$3" = "--verbose" -o "$3" = "-v"
LOG=$?

if echo $2 | grep "$1" &>/dev/null; then
    test $LOG -eq 0 && echo found it
    exit 0
fi
test $LOG -eq 0 && echo did not find it
exit 1