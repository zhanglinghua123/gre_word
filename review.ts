import readline from 'readline';

import fs from 'fs';

interface Data {
  time: Date;
  word: string;
  chinese: string;
  repeatTime: 1|2|3|4|0;
}

function writeDataToFile(data: Data[], filePath: string): void {
  data = data.filter(val=>val.repeatTime <= 4);
  const jsonData = JSON.stringify(data);
  fs.writeFileSync(filePath, jsonData);
}

function readDataFromFile(filePath: string): Data[] {
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData) as Data[];
}

// 示例用法
const filePath = 'dict.json'


function getDaysDiff(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}
function isNeedReview(Data:Data): boolean {
    const diff = getDaysDiff(new Date(Data.time), new Date())
    switch(Data.repeatTime) {
        case 0:
            return true
        case 1:
            return diff > 1;
        case 2:
            return diff > 2;
        case 3:
            return diff > 4;
        case 4:
            return diff > 7;
    }
}



function readNumberFromUserInput(choice: number[], tips :string = '请输入一个数字,1 展示当前需要复习的单词,2 输入新的不会的单词,3 进行复习,0 退出程序:'): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<number>((resolve, reject) => {
    rl.question(tips, (input) => {
      const number = parseFloat(input);
      if (isNaN(number) || !(choice.includes(number)) ) {
        resolve(-1)
        rl.close()
      } else {
        resolve(number);
        rl.close()
      }
    });
  });
}

function readDataFromUserInput(): Promise<Data|null> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    return new Promise<Data|null>((resolve) => {
      rl.question('请输入一个字符串（以逗号分隔word与chinese）：', (input) => {
        rl.close();
        const [word,chinese] = input.split(',');
        if(word && chinese)
            resolve({ repeatTime:0,chinese, word,time:new Date() });
        else
            resolve(null);
      });
    });
  }  


const reviewIng = async (words:Data[]) => {
    let Continue = true
    while(Continue){
        for(let i=0;i< words.length;i++){
            console.log(words[i].word)
            let option = await readNumberFromUserInput([1,0],'你学会了吗?');
            switch(option){
                case 1:
                    words[i].repeatTime+=1   
                    words[i].time = new Date();
                    console.log('the meaning is',words[i].chinese,'\n');
                    break;   
                case 0:
                    console.log('the meaning is',words[i].chinese,'\n');
                    break;
                default:
                    Continue = false;
            }
            if(!Continue) break;
        }
        break;
    }
}
 

const main = async () => {
    console.log('')
    let Continue = true
    const words = readDataFromFile(filePath)
    while(Continue){
        let option = await readNumberFromUserInput([1,2,3,0])
        switch(option){
            case 1:
                for(const word of words){
                    if(isNeedReview(word)){
                        console.log(word.word + ' :  ' + word.chinese)
                    }
                }
                break;
            case 2:
                let newData = await readDataFromUserInput();
                if(newData)
                    words.unshift(newData);
                break;
            case 3:
                await reviewIng(words.filter(val=>isNeedReview(val)))
                console.log('---',words)
                break;
            case 0:
                Continue = false;
                break;
            default:
                break;
        }
    }
    writeDataToFile(words,filePath);
}


main()