#!/bin/bash
# Duplo clique para rodar a experiência neste Mac.
cd "$(dirname "$0")"
PORT=8080
IP=$(ipconfig getifaddr en0 2>/dev/null)
echo ""
echo "  Experiência Maestro rodando"
echo "  Neste computador:            http://localhost:$PORT"
[ -n "$IP" ] && echo "  No tablet (mesma rede Wi-Fi): http://$IP:$PORT"
echo ""
echo "  Feche esta janela para parar."
(sleep 1; open "http://localhost:$PORT") &
python3 -m http.server $PORT
