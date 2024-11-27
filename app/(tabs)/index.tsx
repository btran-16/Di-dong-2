import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from '@react-navigation/native'; 

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [screen, setScreen] = useState("login");
  const navigation = useNavigation();

  // Danh sách người dùng giả lập
  const [users, setUsers] = useState([]);

  const handleLogin = async () => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      Alert.alert("Đăng Nhập Thành Công", `Chào mừng ${user.name}!`);
      navigation.navigate('home');
    } else {
      Alert.alert("Đăng nhập không thành công.", "Vui lòng kiểm tra thông tin.");
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Mật khẩu không khớp.");
      return;
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      Alert.alert("Người dùng đã tồn tại. Vui lòng đăng nhập.");
      return;
    }

    const newUser = { name, email, password };
    setUsers([...users, newUser]);
    Alert.alert("Đăng Ký Thành Công!", "Bạn có thể đăng nhập ngay bây giờ.");
    setScreen("login");
  };

  const handleForgotPassword = async () => {
    Alert.alert("Thông báo", "Chức năng đặt lại mật khẩu không khả dụng.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Image
          source={require('./../../assets/images/logo.png')}
          style={styles.logo}
        />
        {screen === "login" && (
          <>
            <Text style={styles.title}>Đăng Nhập</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen("forgotPassword")}>
              <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen("register")}>
              <Text style={styles.register}>Đăng ký tài khoản</Text>
            </TouchableOpacity>
          </>
        )}
        {screen === "register" && (
          <>
            <Text style={styles.title}>Đăng Ký</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Đăng Ký</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen("login")}>
              <Text style={styles.loginLink}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
        {screen === "forgotPassword" && (
          <>
            <Text style={styles.title}>Quên Mật Khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleForgotPassword}
            >
              <Text style={styles.buttonText}>Đặt Lại Mật Khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen("login")}>
              <Text style={styles.loginLink}>Quay lại Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
    borderRadius: 50,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#fff",
    elevation: 1,
  },
  button: {
    backgroundColor: "#c0c0c0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#000",
    marginTop: 16,
    fontWeight: "500",
    textAlign: 'center',
  },
  register: {
    color: "#000",
    marginTop: 16,
    fontWeight: "500",
    textAlign: 'center',
  },
  loginLink: {
    color: "#000",
    marginTop: 16,
    fontWeight: "500",
    textAlign: 'center',
  },
});
