import React from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useForm } from "react-hook-form";
import { RFValue } from "react-native-responsive-fontsize";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { Input } from "../../components/Form/Input";
import { Button } from "../../components/Form/Button";

import { Container, HeaderTitle, Form } from "./styles";

const KEY = "@passmanager:logins";

interface FormData {
  title: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  title: Yup.string().required("Título é obrigatório!"),
  email: Yup.string()
    .email("Não é um email válido")
    .required("Email é obrigatório!"),
  password: Yup.string().required("Senha é obrigatória!"),
});

export function RegisterLoginData() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleRegister(formData: FormData) {
    try {
      const data = await AsyncStorage.getItem(KEY);
      const passwordList = data ? JSON.parse(data) : [];

      const newLoginData = {
        id: String(uuid.v4()),
        ...formData,
      };

      const formattedList = [...passwordList, newLoginData];
      await AsyncStorage.setItem(KEY, JSON.stringify(formattedList));
      reset();
      Alert.alert("Salvoo");
    } catch (err) {
      Alert.alert("irra");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <Container>
        <HeaderTitle>Salve o login de algum serviço!</HeaderTitle>

        <Form>
          <Input
            title="Título"
            name="title"
            error={errors.title && errors.title.message}
            control={control}
            placeholder="Escreva o título aqui"
            autoCapitalize="sentences"
            autoCorrect
          />
          <Input
            title="Email"
            name="email"
            error={errors.email && errors.email.message}
            control={control}
            placeholder="Escreva o Email aqui"
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            title="Senha"
            name="password"
            error={errors.password && errors.password.message}
            control={control}
            secureTextEntry
            placeholder="Escreva a senha aqui"
          />

          <Button
            style={{
              marginTop: RFValue(26),
            }}
            title="Salvar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
