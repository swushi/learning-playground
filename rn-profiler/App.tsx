import { memo, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";

const MyText = ({ idx }: { idx: number }) => {
  console.log("render MyText");
  const [,setState] = useState(false);
  
  useEffect(() => {
    for (let i = 0; i < 10000; i++) {
      console.log(i);
    }
    setState(x => !x);
  }, [])

  return <Text key={idx}>{idx}</Text>;
};

const MemoMyText = memo(MyText);

const MyImage = ({ idx }: { idx: number }) => {
  console.log("render MyImage");
  for (let i = 0; i < 100; i++) {
    console.log(i);
  }

  return <Image style={StyleSheet.absoluteFillObject} source={{uri: `https://picsum.photos/id/${idx}/1000/1000`}} />
};

const MemoMyImage = memo(MyImage);

export default function App() {
  console.log("render app");
  const [state, setState] = useState<string[]>([]);
  return (
    <View style={styles.container}>
      {state.map((_, idx) => {
        // return <MemoMyImage idx={idx} />;
        return <MyText idx={idx} />;
      })}
      <Button
        title="Add"
        onPress={() => setState((state) => [...state, "idk"])}
      />
      <Button title="Clear" onPress={() => setState([])} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 50,
  },
});
