if ! command -v http-server &> /dev/null
then
    pnpm i -g http-server
fi

http-server -c-1 -o raw.html client/src