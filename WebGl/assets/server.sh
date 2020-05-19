port=`cat .config | grep -oP "\\w+\\s*?=\\s*?\K(\\w+)"`

http-server -p ${port} --cors assets
