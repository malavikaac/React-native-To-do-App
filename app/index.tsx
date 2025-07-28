import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const todoData =[
      {
        id :1,
        title : "todo 1",
        isDone : false,
      },
      {
        id :2,
        title : "todo 2",
        isDone : false,
      },
      {
        id :3,
        title : "todo 3",
        isDone : false,
      },
      {
        id :4,
        title : "todo 4",
        isDone : false,
      },
      {
        id :5,
        title : "todo 5",
        isDone : false,
      },
      {
        id :6,
        title : "todo 6",
        isDone : false,
      },

  ];
  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.hearder}>
        <Ionicons name='menu' size={24} color={'333'}></Ionicons>
        <Image source ={{uri: 'https://xsgames.co/randomusers/avatar.php?g=male'}} style={{width:40, height:40 , borderRadius:20}}/>
      </View>
      <FlatList data={todoData} keyExtractor={(item) =>item.id.toString()} renderItem={({item})=>( 
      <View>
        <Text>{item.title}</Text>
      </View>
      )}/>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container:{
        flex: 1,
       paddingHorizontal : 20,
       backgroundColor : '#f5f5f5'
  },
  hearder:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:20,
  }
}); 