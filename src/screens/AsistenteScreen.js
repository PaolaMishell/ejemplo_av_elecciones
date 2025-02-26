import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

// 🔹 Reemplaza con la IP de tu PC en la red local
const BACKEND_URL = "http://192.168.13.31:8000";

export default function AsistenteScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 📂 **Función para seleccionar y subir un archivo al backend**
  const pickDocument = async () => {
    try {
      console.log("📂 Intentando seleccionar un archivo...");

      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      console.log("📂 Archivo seleccionado:", result);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.warn("⚠️ Selección de archivo cancelada.");
        return;
      }

      let fileUri = result.assets[0].uri;
      let fileName = result.assets[0].name;
      let fileType = result.assets[0].mimeType || "application/octet-stream";

      console.log("🔼 Preparando archivo para subir:", { fileUri, fileName, fileType });

      uploadFile({ uri: fileUri, name: fileName, type: fileType });

    } catch (error) {
      console.error("❌ Error seleccionando archivo:", error);
    }
  };

  // 🔄 **Función para subir el archivo al backend**
  const uploadFile = async (file) => {
    console.log("🔼 Iniciando subida de archivo...", file);

    setLoading(true);
    let formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      console.log("🔹 Respuesta del backend tras subir el archivo:", data);

      if (data.message) {
        setMessages([...messages, { role: "assistant", content: "📂 Archivo subido correctamente. Ahora puedes hacer preguntas sobre él." }]);
      } else {
        setMessages([...messages, { role: "assistant", content: "⚠️ Error al subir el archivo." }]);
      }
    } catch (error) {
      console.error("❌ Error subiendo archivo:", error);
      setMessages([...messages, { role: "assistant", content: "❌ No se pudo subir el archivo." }]);
    } finally {
      setLoading(false);
    }
  };

  // ❓ **Función para enviar preguntas sobre el documento subido**
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `question=${encodeURIComponent(input)}`,
      });

      const data = await response.json();
      console.log("🔹 Respuesta del backend:", data);

      if (data.answer) {
        setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "⚠️ No se recibió una respuesta válida del servidor." }]);
      }
    } catch (error) {
      console.error("Error enviando la pregunta:", error);
      setMessages([...newMessages, { role: "assistant", content: "❌ Error al comunicarse con el servidor." }]);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <Card key={index} style={msg.role === "user" ? styles.userMessage : styles.botMessage}>
            <Text style={msg.role === "user" ? styles.userText : styles.botText}>
              {msg.role === "user" ? "👤 Usuario: " : "🤖 Chatbot: "}
              {msg.content}
            </Text>
          </Card>
        ))}
      </ScrollView>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
          <Icon name="attach-file" size={24} color="white" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Haz una pregunta..."
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 🎨 **Estilos Mejorados**
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 10 },
  chatContainer: { flex: 1 },
  userMessage: {
    backgroundColor: "#007AFF",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  botMessage: {
    backgroundColor: "#34C759",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  userText: { color: "white", fontSize: 16 },
  botText: { color: "white", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 10,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#34C759",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  loading: { marginVertical: 10 },
});

