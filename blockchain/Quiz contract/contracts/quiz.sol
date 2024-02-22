// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SchoolRecord {
    address public principal;

    struct Student {
        string name;
        uint256 rollno;
        string homeaddress;
        uint class;
    }
    
    struct Quiz {
        string quizName;
        string question;
        bool hint;
        mapping(address => uint) scores;
        mapping(address => bool) answers;
    }

    event TeacherAdded(address indexed teacher);
    event TeacherRemoved(address indexed teacher);
    event StudentAdded(uint256 indexed rollno);
    event QuizCreated(uint256 indexed quizCount, string quizName, string question);
    event QuizTaken(address indexed student, uint256 indexed quizCount, bool answer);
    
    mapping (address => mapping(uint256 => bool)) public quizTaken;
    mapping(uint256 => Quiz) public quizzes;
    mapping(uint256 => Student) public students;
    mapping(address=>bool) public teacher;
    uint256 public quizCount;

    constructor() {
        principal = msg.sender;
        teacher[msg.sender] = true;
    }

    modifier onlyPrincipal() {
        require(msg.sender == principal, "Only the principal can add teachers");
        _;
    }

    modifier onlyTeacher() {
        require(teacher[msg.sender], "Only teachers can perform this action");
        _;
    }

    modifier onlyStudent(uint256 _rollno){
        require(students[_rollno].rollno == _rollno, "You are not a student");
        _;
    }

    function teacherAdd(address _teacher) public onlyPrincipal {
        teacher[_teacher] = true;
        emit TeacherAdded(_teacher);
    }

    function teacherRemove(address _teacher) public onlyPrincipal {
        teacher[_teacher] = false;
        emit TeacherRemoved(_teacher);
    }

    function addStudent(string memory name, uint256 rollno, string memory homeaddress, uint class) public onlyTeacher {
        students[rollno] = Student(name, rollno, homeaddress, class);
        emit StudentAdded(rollno);
    }

    function createQuiz(string memory _quizName, string memory _question, bool _hint) public onlyTeacher {
        quizCount++;
        quizzes[quizCount].quizName = _quizName;
        quizzes[quizCount].question = _question;
        quizzes[quizCount].hint = _hint;
        
        emit QuizCreated(quizCount, _quizName, _question);
    }

    function getQuiz(uint256 _quizCount) public view onlyStudent(_quizCount) returns(string memory, string memory) {
        return (quizzes[_quizCount].question, quizzes[_quizCount].quizName);
    }

    function takeQuiz(uint256 _quizCount, bool answer) public onlyStudent(_quizCount) returns(string memory) {
        require(!quizTaken[msg.sender][_quizCount], "Already answered");
        quizzes[_quizCount].answers[msg.sender] = answer;
        quizTaken[msg.sender][_quizCount] = true;

        emit QuizTaken(msg.sender, _quizCount, answer);

        if (quizzes[_quizCount].answers[msg.sender] == quizzes[_quizCount].hint) {
            return "You pass";
        } else {
            return "You fail";
        }
    }
}
