# Используем образ SDK для сборки
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем файл проекта и восстанавливаем зависимости
COPY ["PupupuAi.csproj", "./"]
RUN dotnet restore "PupupuAi.csproj"

# Копируем остальные файлы исходного кода
COPY . .
WORKDIR "/src/."
RUN dotnet publish "PupupuAi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Финальный образ для запуска
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Устанавливаем зависимости для работы ONNX Runtime (если используется CPU)
RUN apt-get update && apt-get install -y libgomp1 libgl1-mesa-glx libglib2.0-0

COPY --from=build /app/publish .

# Копируем модели явно, чтобы убедиться, что они есть (если они не скопировались при publish)
COPY best.onnx .
COPY best.pt .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "PupupuAi.dll"]
