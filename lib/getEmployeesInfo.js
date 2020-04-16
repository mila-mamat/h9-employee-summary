const inquirer = require("inquirer");
const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");

//generating default IDs for user based on the IDs used earlier 
let ID = 1;
let usedID = [];
function generateDefaultID(info) {
  usedID.push(info.employeeID);
  while (usedID.includes(`${ID}`)) {
    ID++;
  }
}

//prompt questions for manager position and collect input
function promptManagerQuestions() {
  let answer;
  return (answer = inquirer.prompt([
    {
      name: "employeeName",
      message: "Team manager's Name: ",
      validate: function (name) {
        return name !== "";
      },
    },
    {
      name: "employeeID",
      message: "Manager's ID:",
      default: `${ID}`, //keep the default value and user input type the same
    },
    {
      name: "employeeEmail",
      message: "Manager's email address:",
      default: "Not provided",
    },
    {
      name: "officeNumber",
      message: "Office number:",
      default: "1",
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
  return (answer = inquirer.prompt([
    {
      name: "employeeName",
      message: "Employee's Name: ",
      validate: function (name) {
        return name !== "";
      },
    },
    {
      name: "employeeID",
      message: "Employee's ID:",
      default: `${ID}`,
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

  for (let i = 1; i <= num; i++) {
    console.log("before question:",ID)
    let info = await promptMemberQuestions();
    generateDefaultID(info);

    //create object for other team members and push them to employees
    if (info.employeeRole === "Engineer") {
      const { employeeName, employeeID, employeeEmail, employeeGithub } = info;
      members.push(
        new Engineer(employeeName, employeeID, employeeEmail, employeeGithub)
      );
    } else if (info.employeeRole === "Intern") {
      const { employeeName, employeeID, employeeEmail, employeeSchool } = info;
      members.push(
        new Intern(employeeName, employeeID, employeeEmail, employeeSchool)
      );
    }
  }
  return members;
}

// create object for manager
async function createManagerObject(info) {
  const { employeeName, employeeID, employeeEmail, officeNumber } = info;
  const manager = new Manager(
    employeeName,
    employeeID,
    employeeEmail,
    officeNumber
  );
  return manager;
}

// prompt questions and get info for manager and members
const getEmployeesInfo = async function () {
  let employees = [];
  //create manager object and push in into employees array
  let managerInfo = await promptManagerQuestions();
  generateDefaultID(managerInfo);
  employees.push(await createManagerObject(managerInfo));
  //create member objects as an array
  let numberOfMember = managerInfo.numberOfMember;
  let members = await createMemberObject(numberOfMember);
  employees = employees.concat(members);
  return employees;
};

module.exports = getEmployeesInfo;
