const fs = require("fs");
const text = fs.readFileSync("./text.txt");
const data = text.toString().split("\n");

const testIt = () => {
  let partialStr = '';
  const finalData = {
    show1: {},
    show2: {}
  };
  let showCounter = 0;

  const insertForShow = ({ packet_type, data_type, ...rest }) => {
    if (packet_type === 1 && data_type === 0) {
      showCounter += 1;
      finalData[`show${showCounter}`]['processed_data'] = rest;
    }
    if (packet_type === 1 && (data_type === 1 || data_type === 2)) {
      const count = (finalData[`show${showCounter}`][`sensor${data_type}`] || 0) + 1;
      finalData[`show${showCounter}`][`sensor${data_type}`] = count;
    }
  }

  const testStr = (jsonStr) => {
    let posOfClose = jsonStr.indexOf('}');
    if (posOfClose === -1) {
      return jsonStr;
    } else {
      const parsedJSON = JSON.parse(jsonStr.slice(0, posOfClose + 1))
      insertForShow(parsedJSON);
      return testStr(jsonStr.slice(posOfClose + 1, jsonStr.length));
    }
  };

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    partialStr = testStr(partialStr + element);
  }
  return finalData;
}

try {
  const finalData = testIt();
  fs.writeFile('output.json', JSON.stringify(finalData), (err) => {
    if (err) throw err;
  });
} catch (error) {
  console.error('YOU MUST NOT BE HERE! 💣', error);
}
