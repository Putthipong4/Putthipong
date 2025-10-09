-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2025 at 07:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `concertticket`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_id` varchar(3) NOT NULL,
  `Firstname` varchar(50) NOT NULL,
  `Lastname` varchar(50) NOT NULL,
  `Telephone` varchar(10) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `concert`
--

CREATE TABLE `concert` (
  `Concert_id` varchar(3) NOT NULL,
  `Poster` varchar(255) NOT NULL,
  `ConcertName` varchar(50) NOT NULL,
  `Price` float NOT NULL,
  `OpenSaleDate` date NOT NULL,
  `OpenSaleTimes` time NOT NULL,
  `Details` varchar(255) NOT NULL,
  `Admin_id` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `Member_id` varchar(3) NOT NULL,
  `Firstname` varchar(50) NOT NULL,
  `Lastname` varchar(50) NOT NULL,
  `Telephone` varchar(10) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `Order_id` varchar(3) NOT NULL,
  `IDCARD` varchar(13) NOT NULL,
  `Price` float DEFAULT NULL,
  `Order_date` date NOT NULL,
  `Order_time` time NOT NULL,
  `Admin_confirm_time` time NOT NULL,
  `People_cancel` varchar(10) NOT NULL,
  `Member_id` varchar(3) NOT NULL,
  `Admin_id` varchar(3) DEFAULT NULL,
  `Status_id` varchar(4) DEFAULT NULL,
  `Receipt_id` int(10) DEFAULT NULL,
  `ShowDate_id` varchar(3) NOT NULL,
  `Seat_Number` varchar(20) NOT NULL,
  `Concert_id` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `Receipt_id` int(10) NOT NULL,
  `Slip_file` varchar(50) NOT NULL,
  `Slip_date` date NOT NULL,
  `Slip_time` time NOT NULL,
  `Receipt_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seat`
--

CREATE TABLE `seat` (
  `Seat_Number` varchar(20) NOT NULL,
  `Seat_Status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `showdate`
--

CREATE TABLE `showdate` (
  `ShowDate_id` varchar(3) NOT NULL,
  `ShowDate` date NOT NULL,
  `ShowStart` time NOT NULL,
  `TotalSeat` int(3) NOT NULL,
  `ShowTime` varchar(2) NOT NULL,
  `Concert_id` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `showdateandseat`
--

CREATE TABLE `showdateandseat` (
  `Status` varchar(10) NOT NULL,
  `ShowDate_id` varchar(3) NOT NULL,
  `Seat_Number` varchar(20) NOT NULL,
  `Concert_id` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `Status_id` varchar(4) NOT NULL,
  `Status_Name` varchar(70) NOT NULL,
  `Admin_id` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_id`);

--
-- Indexes for table `concert`
--
ALTER TABLE `concert`
  ADD PRIMARY KEY (`Concert_id`),
  ADD KEY `concert_ibfk_1` (`Admin_id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`Member_id`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`Order_id`,`Member_id`,`ShowDate_id`,`Seat_Number`,`Concert_id`),
  ADD KEY `Seat_Number` (`Seat_Number`),
  ADD KEY `Concert_id` (`Concert_id`),
  ADD KEY `order_ibfk_3` (`Member_id`),
  ADD KEY `order_ibfk_5` (`ShowDate_id`,`Seat_Number`,`Concert_id`),
  ADD KEY `Receipt_id` (`Receipt_id`) USING BTREE,
  ADD KEY `Admin_id` (`Admin_id`) USING BTREE,
  ADD KEY `Status_id` (`Status_id`) USING BTREE;

--
-- Indexes for table `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`Receipt_id`);

--
-- Indexes for table `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`Seat_Number`);

--
-- Indexes for table `showdate`
--
ALTER TABLE `showdate`
  ADD PRIMARY KEY (`ShowDate_id`),
  ADD KEY `showdate_ibfk1` (`Concert_id`);

--
-- Indexes for table `showdateandseat`
--
ALTER TABLE `showdateandseat`
  ADD PRIMARY KEY (`ShowDate_id`,`Seat_Number`,`Concert_id`),
  ADD KEY `showdateandseat_ibfk_1` (`Concert_id`),
  ADD KEY `showdateandseat_ibfk_3` (`Seat_Number`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`Status_id`),
  ADD KEY `Admin_id` (`Admin_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `receipt`
--
ALTER TABLE `receipt`
  MODIFY `Receipt_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `concert`
--
ALTER TABLE `concert`
  ADD CONSTRAINT `concert_ibfk_1` FOREIGN KEY (`Admin_id`) REFERENCES `admin` (`Admin_id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`Receipt_id`) REFERENCES `receipt` (`Receipt_id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`Admin_id`) REFERENCES `admin` (`Admin_id`),
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`Member_id`) REFERENCES `member` (`Member_id`),
  ADD CONSTRAINT `order_ibfk_4` FOREIGN KEY (`Status_id`) REFERENCES `status` (`Status_id`),
  ADD CONSTRAINT `order_ibfk_5` FOREIGN KEY (`ShowDate_id`,`Seat_Number`,`Concert_id`) REFERENCES `showdateandseat` (`ShowDate_id`, `Seat_Number`, `Concert_id`);

--
-- Constraints for table `showdate`
--
ALTER TABLE `showdate`
  ADD CONSTRAINT `showdate_ibfk1` FOREIGN KEY (`Concert_id`) REFERENCES `concert` (`Concert_id`);

--
-- Constraints for table `showdateandseat`
--
ALTER TABLE `showdateandseat`
  ADD CONSTRAINT `showdateandseat_ibfk_1` FOREIGN KEY (`Concert_id`) REFERENCES `concert` (`Concert_id`),
  ADD CONSTRAINT `showdateandseat_ibfk_2` FOREIGN KEY (`ShowDate_id`) REFERENCES `showdate` (`ShowDate_id`),
  ADD CONSTRAINT `showdateandseat_ibfk_3` FOREIGN KEY (`Seat_Number`) REFERENCES `seat` (`Seat_Number`);

--
-- Constraints for table `status`
--
ALTER TABLE `status`
  ADD CONSTRAINT `status_ibfk_1` FOREIGN KEY (`Admin_id`) REFERENCES `admin` (`Admin_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
