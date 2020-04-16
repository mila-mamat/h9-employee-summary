const inquirer = require("inquirer");
const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");

//assigning ID by default
let ID = 1;
let usedID = []
let defaultID = function () {
    while(usedID.includes(ID)){
      ID++
    }
    usedID.push(ID)
    return ID;
};



//prompt questions for manager position and collect input
function promptManagerQuestions() {
    let answer;
    return (answer = inquirer.prompt([{
            name: "managerName",
            message: "Team manager's Name: ",
            validate: function (name) {
                return name !== "";
            },
        },
        {
            name: "managerID",
            message: "Manager's ID:",
            default: defaultID(),
            
        },
        {
            name: "managerEmail",
            message: "Manager's email address:",
            default: "Not provided",
        },
        {
            name: "officeNumber",
            message: "Office number:",
            default: "1"
        },
        {
            name: "numberOfMember",
            message: "How many members are in the team (excluding the manager)? ",
            default: 1,
            validate: function (name) {
                return !isNaN(name);
            },
        },
    ]));
}

//prompt questions for team members and collect input
function promptMemberQuestions() {
    let answer;
    return (answer = inquirer.prompt([{
            name: "employeeName",
            message: "Employee's Name: ",
            validate: function (name) {
                return name !== "";
            },
        },
        {
            name: "employeeID",
            message: "Employee's ID:",
            default: defaultID(),
        },
        {
            name: "employeeEmail",
            message: "Employee's email address:",
            default: "Not provided",
        },
        {
            type: "list",
            name: "employeeRole",
            message: "What is the role of the employee?",
            choices: ["Engineer", "Intern"],
        },
        {
            name: "employeeSchool",
            message: "School name: ",
            default: "Not provided",
            when: (answers) => answers.employeeRole === "Intern",
        },
        {
            name: "employeeGithub",
            message: "Github username: ",
            default: "Not provided",
            when: (answers) => answers.employeeRole === "Engineer",
        },
    ]));
}

//repeat the team member prompt questions based on the number of team members and create objects
async function createMemberObject(num) {
    let members = [];
    console.log(num)
    for (let i = 1; i <= num; i++) {
        let info = await promptMemberQuestions();
        console.log(num)
        console.log("ID now", ID)
        console.log(usedID)
        
        //create object for other team members and push them to employees
        if (info.employeeRole === "Engineer") {
            const {employeeName,employeeID,employeeEmail,employeeGithub} = info;
            members.push(
                new Engineer(employeeName, employeeID, employeeEmail, employeeGithub)
            );
        } else if (info.employeeRole === "Intern") {
            const {employeeName,employeeID,employeeEmail,employeeSchool} = info;
            members.push(
                new Intern(employeeName, employeeID, employeeEmail, employeeSchool)
            );
        }
    }
    return members;
}

// create object for manager
async function createManagerObject(info) {
    const {
        managerName,
        managerID,
        managerEmail,
        officeNumber
    } = info;
    const manager = new Manager(
        managerName,
        managerID,
        managerEmail,
        officeNumber
    );
    return manager;
}

// prompt questions and get info for manager and members
const getEmployeesInfo = async function () {
    let employees = [];
    //create manager object
    let managerInfo = await promptManagerQuestions();
    employees.push(await createManagerObject(managerInfo));
    //create member objects
    let numberOfMember = managerInfo.numberOfMember;
    console.log(numberOfMember)
    let members = await createMemberObject(numberOfMember);
    employees = employees.concat(members);
    return employees;
};

module.exports = getEmployeesInfo;