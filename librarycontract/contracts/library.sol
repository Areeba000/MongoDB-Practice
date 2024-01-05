// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LibrarySystem {
    address public warden;
    struct Book {
        string title;
        string author;
        bool available;
        address borrower;
        uint256 dueDate;
    }
    mapping(uint256 => Book) public books;
    uint256 public bookCount;
    
    event BookAdded(uint256 indexed bookId, string title, string author);
    event BookBorrowed(uint256 indexed bookId, address borrower, uint256 dueDate);
    event BookReturned(uint256 indexed bookId, address borrower);
    constructor(){
        warden=msg.sender;
    }

    modifier onlyAvailable(uint256 bookId) {
        require(books[bookId].available, "Book is not available");
        _;
    }

    modifier onlywarden{
        require(warden==msg.sender,"you are not warden");
        _;
    }

    function addBook(string memory title, string memory author) public {
        bookCount++;
        books[bookCount] = Book({
            title: title,
            author: author,
            available: true,
            borrower: address(0),
            dueDate: 0
        });
        emit BookAdded(bookCount, title, author);
    }

    function borrowBook(uint256 bookId, uint256 daysToBorrow) public payable  onlyAvailable(bookId) {
        require(msg.value == 1 ether,"not enough ether");
        books[bookId].available = false;
        books[bookId].borrower = msg.sender;
        books[bookId].dueDate = block.timestamp + (daysToBorrow * 1 days);
        emit BookBorrowed(bookId, msg.sender, books[bookId].dueDate);
    }

    function returnBook(uint256 bookId) public  {
        require(books[bookId].borrower == msg.sender, "You are not the borrower");
        books[bookId].available = true;
        books[bookId].borrower = address(0);
        books[bookId].dueDate = 0;
        emit BookReturned(bookId, msg.sender);
    } 
    function withdraw()public  onlywarden {
        payable(warden).transfer(address(this).balance);
     
    }
}
