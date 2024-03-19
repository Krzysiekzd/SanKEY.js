function getInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getIntArr(min, max, length){
  const arr = []
  for (let i = 0;i<length;i++){arr.push(getInt(min, max))}
  return arr
}

function logProgress({totalNumber, currentAttempt}){
  const currentPercentage = currentAttempt/totalNumber*100
  if (currentPercentage%10 === 0){
    console.log(`${currentPercentage}%`)
  }
}

function generateData(numberOfNodes, numberOfLinks){
  const sources = getIntArr(0,numberOfNodes-2,numberOfLinks)
  const targets = getIntArr(2,numberOfNodes,numberOfLinks)
  const value = sources.map((i)=>1)
  return [sources, targets, value]
}

async function generateSankey(source,  target, value){
  const data = [{
    type: "sankey",
    orientation: "h",
    node: {
        pad: 15,
        thickness: 30,
        line: {
            color: "black",
            width: 0.5
        },
    },

    link: {
        source: source,
        target: target,
        value: value,
    }
}]

  const layout = {
      title: "",
      font: {
          size: 10
      }
  }

  const startTime = performance.now()
  await Plotly.react(document.getElementById('plot'), data, layout)
  const endTime = performance.now()
  return endTime - startTime;
}

async function test(numberOfTests, numberOfNodes, numberOfLinks){
  let timeCounter = 0;
  for (let c = 0; c<numberOfTests;c++){
      timeCounter += await generateSankey(...generateData(numberOfNodes,numberOfLinks))
      logProgress({currentAttempt: c+1, totalNumber: numberOfTests})
  }
  document.getElementById('results').innerHTML += `Number of attempts: ${numberOfTests}, n nodes: ${numberOfNodes}, n links: ${numberOfLinks}, mean execution time: ${timeCounter/numberOfTests}ms.<br>`
  console.log(`Number of attempts: ${numberOfTests}, n nodes: ${numberOfNodes}, n links: ${numberOfLinks}, mean execution time: ${timeCounter/numberOfTests}ms.`)
}

async function runTests(configurations){
  for (const {numberOfNodes, numberOfLinks, numberOfTests} of configurations){
    await test(numberOfTests,numberOfNodes, numberOfLinks)
  }
}

const testData = [
  {
    numberOfNodes: 10,
    numberOfLinks: 40,
    numberOfTests: 100
  }, // 6.33
  // {
  //   numberOfNodes: 100,
  //   numberOfLinks: 400,
  //   numberOfTests: 100
  // }, // 56.78
  // {
  //   numberOfNodes: 500,
  //   numberOfLinks: 2000,
  //   numberOfTests: 100
  // }, // 1129.32
  // {
  //   numberOfNodes: 1000,
  //   numberOfLinks: 4000,
  //   numberOfTests: 100
  // }, // 7012.73
  // {
  //   numberOfNodes: 5000,
  //   numberOfLinks: 10000,
  //   numberOfTests: 100
  // }, // 59483.17
  // {
  //   numberOfNodes: 10000,
  //   numberOfLinks: 20000,
  //   numberOfTests: 100
  // }, // 222179.5
]

runTests(testData)