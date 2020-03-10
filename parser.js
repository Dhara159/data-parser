const fs = require("fs");
const text = fs.readFileSync("./text.txt");
const data = text.toString().split("\n");

const testIt = () => {
  let partialStr = '';
  const jsonArr = [];
  const finalData = {
    show1: {},
    show2: {}
  };
  let showCounter = 0;
  let show1Sensor1 = 0;
  let show1Sensor2 = 0;
  let show2Sensor1 = 0;
  let show2Sensor2 = 0;

  const insertForShow = (jsonData) => {
    if (jsonData.packet_type === 1 && jsonData.data_type === 0) {
      showCounter += 1;
      finalData[`show${showCounter}`]['processed_data'] = jsonData;
    }
    if (jsonData.packet_type === 1 && jsonData.data_type === 1) {
      if (showCounter === 1) show1Sensor1 += 1;
      else show2Sensor1 += 1;
    }
    if (jsonData.packet_type === 1 && jsonData.data_type === 2) {
      if (showCounter === 1) show1Sensor2 += 1;
      else show2Sensor2 += 1;
    }
  }

  const testStr = (jsonStr) => {
    try {
      const parsedJSON = JSON.parse(jsonStr)
      jsonArr.push(parsedJSON);
      insertForShow(parsedJSON);
      return '';
    } catch {
      let posOfClose = jsonStr.indexOf('}');
      if (posOfClose === -1) {
        return jsonStr;
      } else {
        try {
          const parsedJSON = JSON.parse(jsonStr.slice(0, posOfClose + 1))
          jsonArr.push(parsedJSON);
          insertForShow(parsedJSON);
          if (posOfClose === jsonStr.length - 1) {
            return '';
          } else {
            return testStr(jsonStr.slice(posOfClose + 1, jsonStr.length));
          }
        } catch (error) {
          console.error('YOU MUST NOT BE HERE! 💣', error);
        }
      }
    }
  };

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (partialStr !== '') {
      partialStr = testStr(partialStr + element);
    } else {
      partialStr = testStr(element);
    }
  }

  finalData['show1']['sensor1'] = show1Sensor1;
  finalData['show1']['sensor2'] = show1Sensor2;
  finalData['show2']['sensor1'] = show2Sensor1;
  finalData['show2']['sensor2'] = show2Sensor2;

  return finalData;
}

console.table(testIt());