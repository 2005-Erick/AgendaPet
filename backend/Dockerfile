# Estágio 1: Build
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copia o wrapper do Maven e os arquivos de configuração
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Garante que o wrapper tem permissão de execução
RUN chmod +x ./mvnw

# Baixa as dependências do projeto (isso cria uma camada de cache no Docker)
RUN ./mvnw dependency:go-offline -B

# Copia o resto do código-fonte
COPY src src

# Faz o build da aplicação pulando os testes (para ser mais rápido no Render)
RUN ./mvnw clean package -DskipTests

# Estágio 2: Runtime (Imagem mais leve apenas para rodar)
FROM eclipse-temurin:25-jre
WORKDIR /app

# Copia apenas o arquivo .jar gerado no estágio de build
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão
EXPOSE 8080

# Comando de inicialização
CMD ["java", "-jar", "app.jar"]
