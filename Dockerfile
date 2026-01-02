# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# WORKDIR /app
# EXPOSE 5000

# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /src
# COPY . .
# RUN dotnet restore "./P10_WebApi.csproj"
# RUN dotnet publish "./P10_WebApi.csproj" -c Release -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=build /app/publish .
# ENTRYPOINT ["dotnet", "P10_WebApi.dll"]


# Use the official ASP.NET Core runtime image as the base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

# Use the SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything and restore dependencies
COPY . .
RUN dotnet restore "P10_WebApi.csproj"

# Build and publish the app in Release mode
RUN dotnet publish "P10_WebApi.csproj" -c Release --no-restore -o /app/publish

# Final stage: runtime image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "P10_WebApi.dll"]
