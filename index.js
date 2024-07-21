"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
function bputResult(regdNo) {
    return __awaiter(this, void 0, void 0, function* () {
        let urls = [
            `https://results.bput.ac.in/student-detsils-results?rollNo=${regdNo}`,
            `https://results.bput.ac.in/student-results-subjects-list?semid=4&rollNo=${regdNo}&session=Even%20(2023-24)`,
            `https://results.bput.ac.in/student-results-sgpa?rollNo=${regdNo}&semid=4&session=Even%20(2023-24)`
        ];
        let requests = urls.map(url => {
            return axios_1.default.request({
                method: 'post',
                maxBodyLength: Infinity,
                url: url,
                headers: {}
            });
        });
        try {
            let responses = yield Promise.all(requests);
            let studentDetails = responses[0].data;
            let subjects = responses[1].data;
            let sgpa = responses[2].data;
            let result = [
                {
                    rollNo: studentDetails.rollNo,
                    name: studentDetails.studentName,
                    college: studentDetails.collegeName,
                    branchName: studentDetails.branchName,
                    sgpa: sgpa.sgpa,
                    // course: studentDetails.courseName,
                },
                {
                    subjects: subjects.map((subject, index) => ({
                        slNo: index + 1,
                        semId: subject.semId,
                        code: subject.subjectCODE,
                        name: subject.subjectName,
                        type: subject.subjectTP,
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
            fs_1.default.writeFileSync('newesultData.json', JSON.stringify(result));
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
;
// async function fetchAllResults(start: number, end: number) {
//     let studentNumbers = Array.from({length: end - start}, (_, i) => start + i);
//     let allResults = await Promise.all(studentNumbers.map(bputResult));
//     fs.writeFileSync('3rdresultData.json', JSON.stringify(allResults));
//   }
//   fetchAllResults(2201294199, 2201294299);
bputResult(2201294112);
