FROM envoyproxy/envoy:v1.14.3
COPY infrastructure/envoy.yaml /etc/envoy/envoy.yaml
EXPOSE 8080
CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml