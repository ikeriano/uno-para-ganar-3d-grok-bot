#!/bin/bash
# genera voz/<hash>.ogg con Piper es_ES (solo las que faltan)
cd "$(dirname "$0")"; W=../app/assets/www/voz; mkdir -p $W; T=/dev/shm/upg/vz; mkdir -p $T
node lineas.js > $T/lista.txt
gen(){ IFS='|' read v h t <<<"$1"; [ -f $W/$h.ogg ] && return; m=${v%%:*}; s=; [[ $v == *:* ]] && s="--speaker ${v#*:}"
 echo "$t" | /workspace/piperenv/bin/piper -m /workspace/piper/es_ES-$m*.onnx $s -f $T/$h.wav 2>/dev/null && ffmpeg -v error -y -i $T/$h.wav -ac 1 -c:a libvorbis -q:a 1 $W/$h.ogg && rm $T/$h.wav; }
export -f gen; export W T
cat $T/lista.txt | tr '\n' '\0' | xargs -0 -P 4 -I{} bash -c 'gen "$@"' _ {}
ls $W | wc -l
