FROM maven:3.9-eclipse-temurin-21-alpine
WORKDIR /app
# 依存関係を先にキャッシュ
COPY pom.xml .
RUN mvn dependency:go-offline -B
# ソースはボリュームマウントで提供されるため不要だが、初回ビルド用にコピー
COPY src ./src
EXPOSE 8080
CMD ["mvn", "spring-boot:run"]
