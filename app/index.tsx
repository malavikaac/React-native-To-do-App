import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// eslint-disable-next-line import/no-named-as-default
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allTodos, setAllTodos] = useState<ToDoType[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await AsyncStorage.getItem("my-todo");
        if (data) {
          const parsed = JSON.parse(data);
          setTodos(parsed);
          setAllTodos(parsed);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!todoText.trim()) return;
    const newTodo: ToDoType = {
      id: Date.now(),
      title: todoText.trim(),
      isDone: false,
    };
    const updatedTodos = [...todos, newTodo];
    try {
      await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
      setAllTodos(updatedTodos);
      setTodoText("");
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: number) => {
    const filtered = todos.filter((todo) => todo.id !== id);
    try {
      await AsyncStorage.setItem("my-todo", JSON.stringify(filtered));
      setTodos(filtered);
      setAllTodos(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDone = async (id: number) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );
    try {
      await AsyncStorage.setItem("my-todo", JSON.stringify(updated));
      setTodos(updated);
      setAllTodos(updated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setTodos(allTodos);
    } else {
      const filtered = allTodos.filter((todo) =>
        todo.title.toLowerCase().includes(text.toLowerCase())
      );
      setTodos(filtered);
    }
  };

  const ToDoItem = ({
    todo,
    onDelete,
    onToggle,
  }: {
    todo: ToDoType;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
  }) => (
    <View style={styles.todoContainer}>
      <View style={styles.todoInfoContainer}>
        <Checkbox
          value={todo.isDone}
          onValueChange={() => onToggle(todo.id)}
          color={todo.isDone ? "#4630EB" : undefined}
        />
        <Text
          style={[
            styles.todoText,
            todo.isDone && { textDecorationLine: "line-through", opacity: 0.6 },
          ]}
        >
          {todo.title}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(todo.id)}>
        <Ionicons name="trash" size={24} color={"red"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert("Menu clicked!")}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color="#333" />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
          clearButtonMode="always"
        />
      </View>

      {/* ToDo List */}
      <FlatList
        data={[...todos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ToDoItem todo={item} onDelete={deleteTodo} onToggle={toggleDone} />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No ToDos Found 😢
          </Text>
        }
      />

      {/* Add ToDo */}
      <KeyboardAvoidingView
        style={styles.footer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={10}
      >
        <TextInput
          placeholder="Add New ToDo"
          value={todoText}
          onChangeText={setTodoText}
          style={styles.newTodoInput}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Ionicons name="add" size={34} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 8,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
    color:'#2e62a7ff'
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
   
  },
  todoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  todoInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  newTodoInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4630EB",
    padding: 8,
    borderRadius: 10,
    marginLeft: 20,
  },
});