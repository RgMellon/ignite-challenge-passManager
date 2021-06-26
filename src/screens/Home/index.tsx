import React, { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { SearchBar } from "../../components/SearchBar";
import { LoginDataItem } from "../../components/LoginDataItem";

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage,
} from "./styles";
import { Alert } from "react-native";

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
}

const KEY = "@passmanager:logins";

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    try {
      const data = await AsyncStorage.getItem(KEY);

      const passwordList = data ? JSON.parse(data) : [];

      setSearchListData(passwordList);
      setData(passwordList);
    } catch (err) {
      Alert.alert("op");
    }
  }

  // useEffect(() => {
  //   loadData();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  function handleFilterLoginData(search: string) {
    if (!search) {
      setSearchListData(data);
      return;
    }

    const formatedQuery = search.toLowerCase();

    const filtredData = data.filter((login: LoginDataProps) => {
      return contains(login, formatedQuery);
    });

    setSearchListData(filtredData);
  }

  const contains = (login: LoginDataProps, query: string) => {
    if (login.title.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  };

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />
      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        }
        renderItem={({ item: loginData }) => {
          return (
            <LoginDataItem
              title={loginData.title}
              email={loginData.email}
              password={loginData.password}
            />
          );
        }}
      />
    </Container>
  );
}
