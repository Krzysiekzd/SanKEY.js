import {PlotCreator} from '../SanKEY_script.js'

function generateSankey(nodesData, linksData, numberOfColumns){
    const startTime = performance.now()
    const plot = new PlotCreator(
        document.getElementById('plot'),nodesData,linksData,1000,500,0,numberOfColumns,{
            show_column_lines: false,
            show_column_names: false,
            linear_gradient_links: false,
            plot_background_color: 'white',
            default_nodes_color: 'black',
            default_links_color: 'black',
        }
    )
    const endTime1 = performance.now()
    plot.reloadPlot()
    const endTime2 = performance.now()
    plot.removePlot()
    return [endTime1 - startTime, endTime2-endTime1]
}

function getInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getColumnAndNodeForLink(nodes,numberOfColumns){
    while (true){
        const columnNumber = getInt(0,numberOfColumns-1)
        const column = nodes[columnNumber]
        if (column.length !==0 ){
            return [columnNumber, getInt(0,column.length-1)]
        }
    }
}

function generateData(numberOfNodes, numberOfLinks, numberOfColumns){
    const nodes = []
    const links = []
    for (let column = 0; column<numberOfColumns;column++ ){nodes.push([])}
    for (let node = 0; node<numberOfNodes;node++ ){nodes[getInt(0,numberOfColumns-1)].push({})}
    for (let link = 0; link<numberOfLinks;link++ ){
        //get nodes
        const [column1, node1] =getColumnAndNodeForLink(nodes, numberOfColumns)
        let [column2, node2] =getColumnAndNodeForLink(nodes, numberOfColumns)
        while (column1 === column2){ 
            // making sure that different column was chosen
            [column2, node2] =getColumnAndNodeForLink(nodes, numberOfColumns)
        }

        links.push({from:{column:column1, node:node1}, to:{column:column2, node:node2}, value: 1})
    }
    return {nodes, links}
}

function logProgress({totalNumber, currentAttempt}){
    const currentPercentage = currentAttempt/totalNumber*100
    if (currentPercentage%10 === 0){
      console.log(`${currentPercentage}%`)
    }
}

function test(numberOfTests, numberOfNodes, numberOfLinks, numberOfColumns){
    let timeCounterCreation = 0;
    let timeCounterReload = 0;
    for (let i = 0; i<numberOfTests;i++){
        const {links, nodes} = generateData(numberOfNodes,numberOfLinks,numberOfColumns)

        const results = generateSankey(nodes,links,numberOfColumns)
        timeCounterCreation+=results[0]
        timeCounterReload+=results[1]
        logProgress({currentAttempt: i+1, totalNumber: numberOfTests})
    }
    const text = `Number of attempts: ${numberOfTests}, n nodes: ${numberOfNodes}, n links: ${numberOfLinks}, n columns: ${numberOfColumns}, mean generate time: ${timeCounterCreation/numberOfTests}ms, mean reload time ${timeCounterReload/numberOfTests}.`;
    document.getElementById('results').innerHTML += `${text}<br>`
    console.log(text)
}

function runTests(configurations){
    for (const {numberOfNodes, numberOfLinks, numberOfTests, numberOfColumns} of configurations){
      test(numberOfTests,numberOfNodes, numberOfLinks, numberOfColumns)
    }
  }

const testData = [
{
    numberOfNodes: 10,
    numberOfLinks: 40,
    numberOfTests: 100,
    numberOfColumns: 5
}, // 0.48, 0.35
// {
//   numberOfNodes: 100,
//   numberOfLinks: 400,
//   numberOfTests: 100,
//   numberOfColumns: 20
// }, // 3.38, 2.81
// {
//   numberOfNodes: 500,
//   numberOfLinks: 2000,
//   numberOfTests: 100,
//   numberOfColumns: 100
// }, // 17.82, 14.89
// {
//   numberOfNodes: 1000,
//   numberOfLinks: 4000,
//   numberOfTests: 100,
//   numberOfColumns: 200
// }, // 38.04, 33.00
// {
//   numberOfNodes: 5000,
//   numberOfLinks: 10000,
//   numberOfTests: 100,
//   numberOfColumns: 1000
// }, // 102.66, 93.49
// {
//   numberOfNodes: 10000,
//   numberOfLinks: 20000,
//   numberOfTests: 100,
//   numberOfColumns: 2000
// }, // 233.26, 187.63
]

runTests(testData)

