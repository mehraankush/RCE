import axios from "axios";
import ProblemModel from "../../models/Problem.model.js";
import Submission from "../../models/Submission.model.js";
import mongoose from "mongoose";
import { formatTokens } from "../../utils/formatoken.js";
import { errorHandler } from "../../utils/ErrorHandler.js";
import { updateStreak } from "../streakController/streak.js";

export const runCode = async (req, res) => {
  try {
    const { problemId, userCode, customInputs, languageId = 54 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID",
      });
    }

    const prob = await ProblemModel.findById(problemId)
      .populate("testCase")
      .populate("problem.ProgrammingLanguage")
      .lean();

    if (!prob) {
      return res.status(404).json({
        success: false,
        message: "Problem/TestCases does not exist",
      });
    }
    // console.log("PROBLEM", prob);
    const findSolutionDrivers = prob.problem.filter(
      (prob) => prob.ProgrammingLanguage.languageId === languageId
    );
    if (!findSolutionDrivers.length) {
      return res.status(404).json({
        success: false,
        message: "We are currently unable to process requests in this language",
      });
    }
    console.log("findSolutionDrivers", findSolutionDrivers);

    const { topDriver, bottomDriver, solutionCode } = findSolutionDrivers[0];
    const userCodeConcatenated = topDriver + userCode + bottomDriver;
    const verifiedSolutionConcatenated =
      topDriver + solutionCode + bottomDriver;

    prob.testCase.testCase = prob.testCase.testCase.map((tc) => ({
      ...tc,
      input: tc.input.replace(",", " "),
    }));

    let combinedTC = [...prob.testCase.testCase];
    let filterCustomInputs2 = [];

    if (customInputs && customInputs.length > 0) {
      const filterCustomInputs = customInputs.map((tc) => ({
        input: tc.input.replace(",", " ").trim(),
        output: "customTC",
      }));

      combinedTC = filterCustomInputs.concat(prob.testCase.testCase);
      filterCustomInputs2 = filterCustomInputs;
    }

    let allTestCasesWithUserCode = await processTestCase(
      userCodeConcatenated,
      verifiedSolutionConcatenated,
      combinedTC,
      filterCustomInputs2,
      languageId
    );

    if (allTestCasesWithUserCode.message === "Time Limit Exceeded") {
      return res.status(200).json({
        success: true,
        message: "Time Limit Exceeded",
        results: allTestCasesWithUserCode.data.slice(
          filterCustomInputs2.length
        ),
      });
    }

    // console.log("allTestCasesWithUserCode", allTestCasesWithUserCode)

    if (filterCustomInputs2.length > 0) {
      for (let i = 0; i < filterCustomInputs2.length; i++) {
        if (
          allTestCasesWithUserCode.data[i] &&
          allTestCasesWithUserCode.data[i + filterCustomInputs2.length] &&
          allTestCasesWithUserCode.data[i].stdout.trim() ===
            allTestCasesWithUserCode.data[
              i + filterCustomInputs2.length
            ].stdout.trim()
        ) {
          allTestCasesWithUserCode.data[
            i + filterCustomInputs2.length
          ].status.description = "Accepted";
          allTestCasesWithUserCode.data[
            i + filterCustomInputs2.length
          ].status.id = 3;
        }
        allTestCasesWithUserCode.data[
          i + filterCustomInputs2.length
        ].Expected_Output = allTestCasesWithUserCode.data[i].stdout;
      }

      allTestCasesWithUserCode.data = allTestCasesWithUserCode.data.slice(
        filterCustomInputs2.length
      );
      allTestCasesWithUserCode.success = true;
    }

    let passedTestCases = 0;
    // console.log("combinedTC", combinedTC)
    allTestCasesWithUserCode.data.forEach((item, index) => {
      item.input = combinedTC[index].input;
      item.Expected_Output = item.Expected_Output
        ? item.Expected_Output
        : combinedTC[index].output || item.Expected_Output;

      if (item.status.id === 3) passedTestCases++;
    });

    if (!allTestCasesWithUserCode.success && filterCustomInputs2.length > 0) {
      return res.status(404).json({
        success: false,
        message: "All test cases should pass",
        status: "Wrong Answer",
        results: allTestCasesWithUserCode,
      });
    }

    return res.status(200).json({
      success: true,
      message: "All test cases passed",
      status: "Accepted",
      PassedTestCases: passedTestCases,
      TotalTestCases: combinedTC.length,
      results: allTestCasesWithUserCode.data.reverse(),
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { problemId, userCode, userId, languageCode = 54 } = req.body;

    // Validate problem, user, and language existence
    // const problem = await Problem.findById(problemId);
    // const user = await User.findById(userId);

    if (!mongoose.Types.ObjectId.isValid(problemId) && !userCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem/userCode ID",
      });
    }

    const prob = await ProblemModel.findById(problemId)
      .populate("testCase")
      .populate("problem.ProgrammingLanguage")
      .lean();

    if (!prob) {
      return res.status(404).json({
        success: false,
        message: "Problem/TestCases does not exist",
      });
    }

    let findSolutionDrivers = prob.problem.filter(
      (prob) => prob.ProgrammingLanguage.languageId === languageCode
    );

    if (!findSolutionDrivers.length) {
      return res.status(404).json({
        success: false,
        message: "we are currently unable to process request in this language",
      });
    }

    const { topDriver, bottomDriver } = findSolutionDrivers[0];
    // user code
    const userCodeConcatenated = topDriver + userCode + bottomDriver;

    prob.testCase.testCase = prob.testCase.testCase.map((tc) => ({
      ...tc,
      input: tc.input.replace(",", " "),
    }));

    let allTestCasesWithUserCode;
    try {
      allTestCasesWithUserCode = await processTestCase(
        userCodeConcatenated,
        null,
        prob.testCase.testCase,
        [],
        languageCode
      );
    } catch (error) {
      const newSubmission = await Submission.create({
        problem: problemId,
        user: userId,
        attempts: ["Wrong Answer"],
        solution: {
          language: findSolutionDrivers[0].ProgrammingLanguage._id,
          code: userCode,
        },
      });
      const submitSolution = await newSubmission.save();

      return res.status(200).json({
        success: true,
        message: "Solution submitted succesfully",
        submissionId: submitSolution._id,
        results: submitSolution,
      });
    }

    console.log("allTestCasesWithUserCode", allTestCasesWithUserCode);
    if (allTestCasesWithUserCode.wrongAnswer) {
      const newSubmission = await Submission.create({
        problem: problemId,
        user: userId,
        attempts: ["Wrong Answer"],
        solution: {
          language: findSolutionDrivers[0].ProgrammingLanguage._id,
          code: userCode,
        },
      });
      const submitSolution = await newSubmission.save();

      return errorHandler(
        res,
        "All Test cases Should pass",
        200,
        { submissionId: submitSolution._id },
        { submitSolution: submitSolution },
        { result: allTestCasesWithUserCode.data }
      );
    }

    const newSubmission = await Submission.create({
      problem: problemId,
      user: userId,
      attempts: ["Accepted"],
      solution: {
        language: findSolutionDrivers[0].ProgrammingLanguage._id,
        code: userCode,
      },
    });

    const submitSolution = await newSubmission.save();
    await updateStreak(submitSolution.user);

    return res.status(200).json({
      success: true,
      message: "Solution submitted succesfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to process a single test case

const processTestCase = async (
    userCodeConcatenated,
    solutionCode = null,
    allTestcases,
    customTestcases = [],
    language
) => {
    let userSubmissions = allTestcases.map((input) => ({
        source_code: userCodeConcatenated,
        language_id: language,
        stdin: input.input,
        expected_output: input.output,
    }));

    if (solutionCode && customTestcases.length > 0) {
        // Custom test case with inbuilt solution
        const customTestcasesSubmissions = customTestcases.map((input) => ({
            source_code: solutionCode,
            language_id: language,
            stdin: input.input,
            expected_output: input.output,
        }));

        userSubmissions = [...customTestcasesSubmissions, ...userSubmissions];
    }


    try {
        // User code validation on inbuilt test cases
        const userSubmissionResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_JUDG0}/submissions/batch`,
            { submissions: userSubmissions }
        );

        const userToken = formatTokens(userSubmissionResponse.data);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: API call exceeded 10 seconds.')), 10000);
        });

        while (true) {
            try {
                const userResultPromise = axios.get(
                    `${process.env.NEXT_PUBLIC_JUDG0}/submissions/batch?tokens=${userToken}`
                );
                const result = await Promise.race([userResultPromise, timeoutPromise]);

                const userSubmissionsStatus = result.data.submissions;
                const runtimeErrorIds = new Set([7, 8, 9, 10, 11, 12 ]);

                for (const submission of userSubmissionsStatus) {
                    if (submission.status.id === 6) {
                        throw { ...submission, errorType: "Compilation Error" };
                    } else if (runtimeErrorIds.has(submission.status.id)) {
                        throw { ...submission, errorType: "Runtime Error" };
                    }
                    else if (submission.status.id === 13) {
                        throw { ...submission, errorType: "Runtime Error" };
                    }
                    else if (submission.status.id === 14) {
                        throw { ...submission, errorType: "Runtime Error" };
                    }
                }
                const allAccepted = userSubmissionsStatus.every(
                    (submission) =>
                        submission.status.id === 3 ||
                        submission.status.id === 4 ||
                        submission.status.id === 5
                );
                const wrongAnswer = userSubmissionsStatus.some(
                    (submission) => submission.status.id === 4
                );
                const TLE = userSubmissionsStatus.some(
                    (submission) => submission.status.id === 5
                );

                if (allAccepted) {
                    return {
                        success: true,
                        wrongAnswer,
                        TLE,
                        data: userSubmissionsStatus,
                    };
                }

                // Wait for some time before making the next API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (error) {
                throw error;
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || "Request failed",
            error,
        };
    }
};

// const processTestCase = async (
//     userCodeConcatenated,
//     solutionCode = null,
//     allTestcases,
//     customtestcase = [],
//     language
// ) => {
//     // console.log("INPUT", input)
//     let userSubmissions = allTestcases.map((input) => ({
//         source_code: userCodeConcatenated,
//         language_id: language,
//         stdin: input.input,
//         expected_output: input.output,
//     }));

//     if (solutionCode && customtestcase) {
//         // custom test case with inbuild solution
//         const customtestcases = customtestcase.map((input) => ({
//             source_code: solutionCode,
//             language_id: language,
//             stdin: input.input,
//             expected_output: input.output,
//         }))

//         userSubmissions = [...customtestcases, ...userSubmissions];
//     }

//     // user code validation on inbuild test cases
//     const userSubmissionResponse = await axios.post(`${process.env.NEXT_PUBLIC_JUDG0}/submissions/batch`, {
//         submissions: userSubmissions
//     });
//     const userToken = formatTokens(userSubmissionResponse.data);
//     // console.log("userToken", userToken)
//     const timeoutPromise = new Promise((_, reject) => {
//         setTimeout(() => reject(new Error('Timeout: API call exceeded 10 seconds.')), 10000);
//     });

//     while (true) {

//         try {
//             const userResultPromise = await axios.get(`${process.env.NEXT_PUBLIC_JUDG0}/submissions/batch?tokens=${userToken}`);
//             const result = await Promise.race([userResultPromise, timeoutPromise]);

//             const userSubmissionsStatus = result.data.submissions;
//             console.log("userResultPromise.data.submissions", userResultPromise.data.submissions)
//             const runtimeErrorIds = new Set([7, 8, 9, 10, 11, 12]);

//             // const CheckTLE = userSubmissionsStatus.some((submission) => submission.status.id === 5)
//             // console.log("CheckTLE", CheckTLE)
//             // if (CheckTLE) {
//             //     return {
//             //         success: false,
//             //         message: "Time Limit Exceeded",
//             //         data: userResultPromise.data.submissions
//             //     };
//             // }

//             for (const submission of userSubmissionsStatus) {
//                 if (submission.status.id === 6) {
//                     throw { ...submission, errorType: "Compilation Error" };
//                 } else if (runtimeErrorIds.has(submission.status.id)) {
//                     throw { ...submission, errorType: "Runtime Error" };
//                 }
//                 else if (submission.status.id === 13) {
//                     throw { ...submission, errorType: "Runtime Error" };
//                 }
//                 else if (submission.status.id === 14) {
//                     throw { ...submission, errorType: "Runtime Error" };
//                 }
//             }


//             const allAccepted = userSubmissionsStatus.every(submission => submission.status.id === 3 || submission.status.id === 4 || submission.status.id === 5);
//             const wrongAnswer = userSubmissionsStatus.some(submission => submission.status.id === 4);
//             const TLE = userSubmissionsStatus.some(submission => submission.status.id === 5);

//             if (allAccepted) {
//                 return {
//                     success: false,
//                     wrongAnswer: wrongAnswer,
//                     TLE,
//                     data: userResultPromise.data.submissions
//                 };
//             }

//             // Wait for some time before making the next API call
//             await new Promise(resolve => setTimeout(resolve, 1000));

//         } catch (error) {
//             throw error
//         }

//     }
// }


