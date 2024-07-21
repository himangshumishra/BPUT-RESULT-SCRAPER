import axios from 'axios';
import fs from 'fs';

async function bputResult(regdNo: number) {
  let urls = [
    `https://results.bput.ac.in/student-detsils-results?rollNo=${regdNo}`,
    `https://results.bput.ac.in/student-results-subjects-list?semid=4&rollNo=${regdNo}&session=Even%20(2023-24)`,
    `https://results.bput.ac.in/student-results-sgpa?rollNo=${regdNo}&semid=4&session=Even%20(2023-24)`
  ];

  let requests = urls.map(url => {
    return axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: { }
    });
  });

  try {
    let responses = await Promise.all(requests);
    let studentDetails = responses[0].data;
    let subjects = responses[1].data;
    let sgpa = responses[2].data;


    let result = [
      {
          rollNo: studentDetails.rollNo,
        name: studentDetails.studentName,
        college:studentDetails.collegeName,
        branchName: studentDetails.branchName,
        sgpa:sgpa.sgpa,
        // course: studentDetails.courseName,
      
      },
      {
        subjects: subjects.map((subject: any,index:number) => ({
        slNo:index+1,
        semId:subject.semId,
        code: subject.subjectCODE,
          name: subject.subjectName,
          type:subject.subjectTP,
          credits: subject.subjectCredits,
          grade: subject.grade,
          points: subject.points
        }))
      }
    ];

//     console.log(requests);
//     console.log(responses[1].data);
// console.log(result);
// console.log(sgpa);

fs.writeFileSync('newesultData.json', JSON.stringify(result));

    return result;

    
  } catch (error) {
    console.log(error);
  }
};

// async function fetchAllResults(start: number, end: number) {
//     let studentNumbers = Array.from({length: end - start}, (_, i) => start + i);
//     let allResults = await Promise.all(studentNumbers.map(bputResult));
  
//     fs.writeFileSync('3rdresultData.json', JSON.stringify(allResults));
    
//   }
  
//   fetchAllResults(2201294199, 2201294299);
  bputResult(2201294112);