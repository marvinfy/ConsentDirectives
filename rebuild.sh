if [ -d "./build" ]; then
  rm -rf ./build
fi

truffle compile

if [[ $? -eq 0 ]]; then
  if [ -d "./webapp/app/contracts/" ]; then
    rm -rf ./webapp/app/contracts/
  fi

  cp -r ./build/contracts/ ./webapp/app/contracts/

  truffle migrate

  if [[ $? -eq 0 ]]; then
    truffle test
  fi
  
fi
