// TODO: Write code to define and export the Employee class
class Employee {
    constructor(name, id, email) {
        

        this.name = name;
        this.id = id,
        this.email = email
    }

    getName() {
          return this.name.split(" ").map(function(word){
               return word.charAt(0).toUpperCase()+word.slice(1)
            }).join(" ")
            
    }
    getId() {
        return this.id
    }
    getEmail() {
        return this.email
    }
    getRole() {
        return "Employee"
    } // Returns 'Employee'
}

module.exports = Employee