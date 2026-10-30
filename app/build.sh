set -e
cd "$(dirname "$0")"
export JAVA_HOME=/home/box/jdk17 PATH=/home/box/jdk17/bin:$PATH
BT=/home/box/android-sdk/build-tools/34.0.0; AJ=/home/box/android-sdk/platforms/android-34/android.jar
KS=${KS:-/workspace/keys/unoparaganar-release.jks}
: "${KS_PASS:?Define KS_PASS con la contraseña del keystore}"
O=/dev/shm/upg/out; rm -rf $O; mkdir -p $O/c $O/dex
$BT/aapt2 compile --dir res -o $O/res.zip
$BT/aapt2 link -o $O/base.apk -I $AJ --manifest AndroidManifest.xml $( [ -d assets ] && echo "-A assets" ) $O/res.zip
javac -Xlint:-options --release 8 -cp $AJ -d $O/c $(find src -name '*.java')
$BT/d8 --min-api 21 --release --lib $AJ --output $O/dex $(find $O/c -name '*.class')
cp $O/base.apk $O/u.apk; python3 -c "import zipfile;zipfile.ZipFile('$O/u.apk','a').write('$O/dex/classes.dex','classes.dex')"
$BT/zipalign -f 4 $O/u.apk $O/a.apk
[ -f $KS ] || keytool -genkeypair -keystore $KS -alias upg -keyalg RSA -keysize 2048 -validity 10000 -storepass:env KS_PASS -keypass:env KS_PASS -dname "CN=Uno para ganar 3D, O=Show Time TV, C=ES"
$BT/apksigner sign --ks $KS --ks-pass env:KS_PASS --key-pass env:KS_PASS --out ${APK:-/dev/shm/upg/UnoParaGanar3D-v1.0.apk} $O/a.apk
$BT/apksigner verify -v ${APK:-/dev/shm/upg/UnoParaGanar3D-v1.0.apk} | head -4
rm -rf $O
