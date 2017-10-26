if [ -d "./build" ]; then
  rm -rf ./build
fi

truffle compile

if [[ $? -eq 0 ]]; then
  truffle migrate

  if [[ $? -eq 0 ]]; then
    truffle test
  fi
  
fi
