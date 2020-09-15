import * as docker from "@pulumi/docker";

const backendImage = new docker.Image("backend", {
  imageName: "backend",
  build: {
    context: "../",
    dockerfile: "./backend.Dockerfile",
  },
  skipPush: true,
});

const envoyImage = new docker.Image("envoy", {
  imageName: "envoy",
  build: {
    context: "../",
    dockerfile: "./envoy.Dockerfile",
  },
  skipPush: true,
});

const network = new docker.Network("network");

const backendContainer = new docker.Container("backend", {
  image: backendImage.imageName,
  networksAdvanced: [{ name: network.name }],
  ports: [
    {
      internal: 50051,
      external: 50051,
    },
  ],
});

const envoyContainer = new docker.Container("envoy", {
  image: envoyImage.imageName,
  networksAdvanced: [{ name: network.name }],
  ports: [
    {
      internal: 8080,
      external: 8080,
    },
  ],
});

export const envoyImageName = envoyImage.imageName;

export const backendEndpoints = backendContainer.ports.apply(
  (ports) => `${ports![0].ip}:${ports![0].external}`
);

export const envoyEndpoints = envoyContainer.ports.apply(
  (ports) => `${ports![0].ip}:${ports![0].external}`
);
