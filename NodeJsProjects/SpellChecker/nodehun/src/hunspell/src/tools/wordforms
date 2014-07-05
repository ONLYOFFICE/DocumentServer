#!/bin/sh
case $# in
0|1|2) echo "Usage: wordforms [-s | -p] dictionary.aff dictionary.dic word
-s: print only suffixed forms
-p: print only prefixed forms
"; exit 1;;
esac
fx=0
case $1 in
-s) fx=1; shift;;
-p) fx=2; shift;;
esac
test -h /tmp/wordforms.aff && rm /tmp/wordforms.aff
ln -s $PWD/$1 /tmp/wordforms.aff
# prepared dic only with the query word
echo 1 >/tmp/wordforms.dic
grep "^$3/" $2 >>/tmp/wordforms.dic
echo $3 | awk -v "fx=$fx" '
fx!=2 && FILENAME!="-" && /^SFX/ && NF > 4{split($4,a,"/");clen=($3=="0") ? 0 : length($3);sfx[a[1],clen]=a[1];sfxc[a[1],clen]=clen;next}
fx!=1 && FILENAME!="-" && /^PFX/ && NF > 4{split($4,a,"/");clen=($3=="0") ? 0 : length($3);pfx[a[1],clen]=a[1];pfxc[a[1],clen]=clen;next}
FILENAME=="-"{
wlen=length($1)
if (fx==0 || fx==2) {
    for (j in pfx) {if (wlen<=pfxc[j]) continue; print (pfx[j]=="0" ? "" : pfx[j]) substr($1, pfxc[j]+1)}
}
if (fx==0 || fx==1) {
  for(i in sfx){clen=sfxc[i];if (wlen<=clen) continue; print substr($1, 1, wlen-clen) (sfx[i]=="0" ? "": sfx[i]) }
}
if (fx==0) {
for (j in pfx) {if (wlen<=pfxc[j]) continue;
  for(i in sfx){clen=sfxc[i];if (wlen<=clen || wlen <= (clen + pfxc[j]))continue;
      print (pfx[j]=="0" ? "" : pfx[j]) substr($1, pfxc[j]+1, wlen-clen-pfxc[j]) (sfx[i]=="0" ? "": sfx[i]) }}
}
}
' /tmp/wordforms.aff - | hunspell -d /tmp/wordforms -G -l
