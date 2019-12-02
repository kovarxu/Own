import "core-js/stable";
import "regenerator-runtime/runtime";

async function man () {
  await dog()
  console.log('man')
  console.log(regeneratorRuntime)
}

async function dog () {
  setTimeout((data) => console.log(data), 1000, 'dog') 
}

man()
