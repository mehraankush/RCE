export const validateProblemInput = (input) => {
    const {
        title,
        description,
        difficulty,
        tags,
        companies,
        topDriver,
        boilerplate,
        bottomDriver,
        solutionCode,
        language,
    } = input;

    if (
        !title ||
        !description ||
        !bottomDriver ||
        !topDriver ||
        !solutionCode ||
        !language
    ) {
        return "400: Invalid Input - title, description, difficulty, tags, bottom driver, solution code, top driver, language all are required";
    }
    return null;
};