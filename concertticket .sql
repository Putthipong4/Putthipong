-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 13, 2025 at 07:22 PM
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

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_id`, `Firstname`, `Lastname`, `Telephone`, `Email`, `Password`) VALUES
('A01', 'พุติพงศ์', 'สุขรี', '0623543667', 'putthipong.s@ku.th', '$2b$10$yxZNTJo3RVIcTKKmjw/x3uhFX1RBaFUCJS7T1J.zXOpZlBimDUjtq'),
('A02', 'Admin', 'test', '0123456789', 'Admin123@gmail.com', '$2b$10$Fa9js9dO1JbAVoqk58zG4.x9cD1TQ1qmMwaG97Qak32.TDLWYGLB6'),
('A03', 'jim', 'Doe', '0123456789', 'jim123@gmail.com', '$2b$10$6dubS/JzwxxrkiToo9QYz.EPkHC3zHCT/gXYFrdkggFOi7bs70RcS'),
('A04', 'Chris', 'Smith', '0234563453', 'chris123@gmail.com', '$2b$10$iRuTZ1YbJZ6aFDPywpJy9.s1HrdVEwo5tUB4DbTvdeth6BJD3CKrm'),
('A05', 'ad', 'min', '0213456778', 'addd12@gmail.com', '$2b$10$9AfREZ5qMc5.eiAs5316sOgbcuZRAwk/YduZx0Tro3ZOQfz0E0kNK'),
('A06', 'john', 'fkennady', '0231311234', 'johncena12345@gmail.com', '$2b$10$YjXiGewWEycWMvitDyArkeIN2ztEpA/cgE8Tpv03vfrkL2S46dzJW');

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
  `Concert_id` varchar(3) NOT NULL,
  `Rating` int(2) DEFAULT NULL
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

--
-- Dumping data for table `seat`
--

INSERT INTO `seat` (`Seat_Number`, `Seat_Status`) VALUES
('A01', 'ปกติ'),
('A02', 'ปกติ'),
('A03', 'ปกติ'),
('A04', 'ปกติ'),
('A05', 'ปกติ'),
('A06', 'ปกติ'),
('A07', 'ปกติ'),
('A08', 'ปกติ'),
('A09', 'ปกติ'),
('A10', 'ปกติ'),
('A11', 'ปกติ'),
('A12', 'ปกติ'),
('A13', 'ปกติ'),
('A14', 'ปกติ'),
('A15', 'ปกติ'),
('A16', 'ปกติ'),
('A17', 'ปกติ'),
('A18', 'ปกติ'),
('A19', 'ปกติ'),
('A20', 'ปกติ'),
('A21', 'ปกติ'),
('A22', 'ปกติ'),
('A23', 'ปกติ'),
('A24', 'ปกติ'),
('A25', 'ปกติ'),
('B01', 'ปกติ'),
('B02', 'ปกติ'),
('B03', 'ปกติ'),
('B04', 'ปกติ'),
('B05', 'ปกติ'),
('B06', 'ปกติ'),
('B07', 'ปกติ'),
('B08', 'ปกติ'),
('B09', 'ปกติ'),
('B10', 'ปกติ'),
('B11', 'ปกติ'),
('B12', 'ปกติ'),
('B13', 'ปกติ'),
('B14', 'ปกติ'),
('B15', 'ปกติ'),
('B16', 'ปกติ'),
('B17', 'ปกติ'),
('B18', 'ปกติ'),
('B19', 'ปกติ'),
('B20', 'ปกติ'),
('B21', 'ปกติ'),
('B22', 'ปกติ'),
('B23', 'ปกติ'),
('B24', 'ปกติ'),
('B25', 'ปกติ'),
('C01', 'ปกติ'),
('C02', 'ปกติ'),
('C03', 'ปกติ'),
('C04', 'ปกติ'),
('C05', 'ปกติ'),
('C06', 'ปกติ'),
('C07', 'ปกติ'),
('C08', 'ปกติ'),
('C09', 'ปกติ'),
('C10', 'ปกติ'),
('C11', 'ปกติ'),
('C12', 'ปกติ'),
('C13', 'ปกติ'),
('C14', 'ปกติ'),
('C15', 'ปกติ'),
('C16', 'ปกติ'),
('C17', 'ปกติ'),
('C18', 'ปกติ'),
('C19', 'ปกติ'),
('C20', 'ปกติ'),
('C21', 'ปกติ'),
('C22', 'ปกติ'),
('C23', 'ปกติ'),
('C24', 'ปกติ'),
('C25', 'ปกติ'),
('D01', 'ปกติ'),
('D02', 'ปกติ'),
('D03', 'ปกติ'),
('D04', 'ปกติ'),
('D05', 'ปกติ'),
('D06', 'ปกติ'),
('D07', 'ปกติ'),
('D08', 'ปกติ'),
('D09', 'ปกติ'),
('D10', 'ปกติ'),
('D11', 'ปกติ'),
('D12', 'ปกติ'),
('D13', 'ปกติ'),
('D14', 'ปกติ'),
('D15', 'ปกติ'),
('D16', 'ปกติ'),
('D17', 'ปกติ'),
('D18', 'ปกติ'),
('D19', 'ปกติ'),
('D20', 'ปกติ'),
('D21', 'ปกติ'),
('D22', 'ปกติ'),
('D23', 'ปกติ'),
('D24', 'ปกติ'),
('D25', 'ปกติ'),
('E01', 'ปกติ'),
('E02', 'ปกติ'),
('E03', 'ปกติ'),
('E04', 'ปกติ'),
('E05', 'ปกติ'),
('E06', 'ปกติ'),
('E07', 'ปกติ'),
('E08', 'ปกติ'),
('E09', 'ปกติ'),
('E10', 'ปกติ'),
('E11', 'ปกติ'),
('E12', 'ปกติ'),
('E13', 'ปกติ'),
('E14', 'ปกติ'),
('E15', 'ปกติ'),
('E16', 'ปกติ'),
('E17', 'ปกติ'),
('E18', 'ปกติ'),
('E19', 'ปกติ'),
('E20', 'ปกติ'),
('E21', 'ปกติ'),
('E22', 'ปกติ'),
('E23', 'ปกติ'),
('E24', 'ปกติ'),
('E25', 'ปกติ'),
('F01', 'ปกติ'),
('F02', 'ปกติ'),
('F03', 'ปกติ'),
('F04', 'ปกติ'),
('F05', 'ปกติ'),
('F06', 'ปกติ'),
('F07', 'ปกติ'),
('F08', 'ปกติ'),
('F09', 'ปกติ'),
('F10', 'ปกติ'),
('F11', 'ปกติ'),
('F12', 'ปกติ'),
('F13', 'ปกติ'),
('F14', 'ปกติ'),
('F15', 'ปกติ'),
('F16', 'ปกติ'),
('F17', 'ปกติ'),
('F18', 'ปกติ'),
('F19', 'ปกติ'),
('F20', 'ปกติ'),
('F21', 'ปกติ'),
('F22', 'ปกติ'),
('F23', 'ปกติ'),
('F24', 'ปกติ'),
('F25', 'ปกติ'),
('G01', 'ปกติ'),
('G02', 'ปกติ'),
('G03', 'ปกติ'),
('G04', 'ปกติ'),
('G05', 'ปกติ'),
('G06', 'ปกติ'),
('G07', 'ปกติ'),
('G08', 'ปกติ'),
('G09', 'ปกติ'),
('G10', 'ปกติ'),
('G11', 'ปกติ'),
('G12', 'ปกติ'),
('G13', 'ปกติ'),
('G14', 'ปกติ'),
('G15', 'ปกติ'),
('G16', 'ปกติ'),
('G17', 'ปกติ'),
('G18', 'ปกติ'),
('G19', 'ปกติ'),
('G20', 'ปกติ'),
('G21', 'ปกติ'),
('G22', 'ปกติ'),
('G23', 'ปกติ'),
('G24', 'ปกติ'),
('G25', 'ปกติ'),
('H01', 'ปกติ'),
('H02', 'ปกติ'),
('H03', 'ปกติ'),
('H04', 'ปกติ'),
('H05', 'ปกติ'),
('H06', 'ปกติ'),
('H07', 'ปกติ'),
('H08', 'ปกติ'),
('H09', 'ปกติ'),
('H10', 'ปกติ'),
('H11', 'ปกติ'),
('H12', 'ปกติ'),
('H13', 'ปกติ'),
('H14', 'ปกติ'),
('H15', 'ปกติ'),
('H16', 'ปกติ'),
('H17', 'ปกติ'),
('H18', 'ปกติ'),
('H19', 'ปกติ'),
('H20', 'ปกติ'),
('H21', 'ปกติ'),
('H22', 'ปกติ'),
('H23', 'ปกติ'),
('H24', 'ปกติ'),
('H25', 'ปกติ'),
('I01', 'ปกติ'),
('I02', 'ปกติ'),
('I03', 'ปกติ'),
('I04', 'ปกติ'),
('I05', 'ปกติ'),
('I06', 'ปกติ'),
('I07', 'ปกติ'),
('I08', 'ปกติ'),
('I09', 'ปกติ'),
('I10', 'ปกติ'),
('I11', 'ปกติ'),
('I12', 'ปกติ'),
('I13', 'ปกติ'),
('I14', 'ปกติ'),
('I15', 'ปกติ'),
('I16', 'ปกติ'),
('I17', 'ปกติ'),
('I18', 'ปกติ'),
('I19', 'ปกติ'),
('I20', 'ปกติ'),
('I21', 'ปกติ'),
('I22', 'ปกติ'),
('I23', 'ปกติ'),
('I24', 'ปกติ'),
('I25', 'ปกติ'),
('J01', 'ปกติ'),
('J02', 'ปกติ'),
('J03', 'ปกติ'),
('J04', 'ปกติ'),
('J05', 'ปกติ'),
('J06', 'ปกติ'),
('J07', 'ปกติ'),
('J08', 'ปกติ'),
('J09', 'ปกติ'),
('J10', 'ปกติ'),
('J11', 'ปกติ'),
('J12', 'ปกติ'),
('J13', 'ปกติ'),
('J14', 'ปกติ'),
('J15', 'ปกติ'),
('J16', 'ปกติ'),
('J17', 'ปกติ'),
('J18', 'ปกติ'),
('J19', 'ปกติ'),
('J20', 'ปกติ'),
('J21', 'ปกติ'),
('J22', 'ปกติ'),
('J23', 'ปกติ'),
('J24', 'ปกติ'),
('J25', 'ปกติ'),
('K01', 'ปกติ'),
('K02', 'ปกติ'),
('K03', 'ปกติ'),
('K04', 'ปกติ'),
('K05', 'ปกติ'),
('K06', 'ปกติ'),
('K07', 'ปกติ'),
('K08', 'ปกติ'),
('K09', 'ปกติ'),
('K10', 'ปกติ'),
('K11', 'ปกติ'),
('K12', 'ปกติ'),
('K13', 'ปกติ'),
('K14', 'ปกติ'),
('K15', 'ปกติ'),
('K16', 'ปกติ'),
('K17', 'ปกติ'),
('K18', 'ปกติ'),
('K19', 'ปกติ'),
('K20', 'ปกติ'),
('K21', 'ปกติ'),
('K22', 'ปกติ'),
('K23', 'ปกติ'),
('K24', 'ปกติ'),
('K25', 'ปกติ'),
('L01', 'ปกติ'),
('L02', 'ปกติ'),
('L03', 'ปกติ'),
('L04', 'ปกติ'),
('L05', 'ปกติ'),
('L06', 'ปกติ'),
('L07', 'ปกติ'),
('L08', 'ปกติ'),
('L09', 'ปกติ'),
('L10', 'ปกติ'),
('L11', 'ปกติ'),
('L12', 'ปกติ'),
('L13', 'ปกติ'),
('L14', 'ปกติ'),
('L15', 'ปกติ'),
('L16', 'ปกติ'),
('L17', 'ปกติ'),
('L18', 'ปกติ'),
('L19', 'ปกติ'),
('L20', 'ปกติ'),
('L21', 'ปกติ'),
('L22', 'ปกติ'),
('L23', 'ปกติ'),
('L24', 'ปกติ'),
('L25', 'ปกติ'),
('M01', 'ปกติ'),
('M02', 'ปกติ'),
('M03', 'ปกติ'),
('M04', 'ปกติ'),
('M05', 'ปกติ'),
('M06', 'ปกติ'),
('M07', 'ปกติ'),
('M08', 'ปกติ'),
('M09', 'ปกติ'),
('M10', 'ปกติ'),
('M11', 'ปกติ'),
('M12', 'ปกติ'),
('M13', 'ปกติ'),
('M14', 'ปกติ'),
('M15', 'ปกติ'),
('M16', 'ปกติ'),
('M17', 'ปกติ'),
('M18', 'ปกติ'),
('M19', 'ปกติ'),
('M20', 'ปกติ'),
('M21', 'ปกติ'),
('M22', 'ปกติ'),
('M23', 'ปกติ'),
('M24', 'ปกติ'),
('M25', 'ปกติ'),
('N01', 'ปกติ'),
('N02', 'ปกติ'),
('N03', 'ปกติ'),
('N04', 'ปกติ'),
('N05', 'ปกติ'),
('N06', 'ปกติ'),
('N07', 'ปกติ'),
('N08', 'ปกติ'),
('N09', 'ปกติ'),
('N10', 'ปกติ'),
('N11', 'ปกติ'),
('N12', 'ปกติ'),
('N13', 'ปกติ'),
('N14', 'ปกติ'),
('N15', 'ปกติ'),
('N16', 'ปกติ'),
('N17', 'ปกติ'),
('N18', 'ปกติ'),
('N19', 'ปกติ'),
('N20', 'ปกติ'),
('N21', 'ปกติ'),
('N22', 'ปกติ'),
('N23', 'ปกติ'),
('N24', 'ปกติ'),
('N25', 'ปกติ'),
('O01', 'ปกติ'),
('O02', 'ปกติ'),
('O03', 'ปกติ'),
('O04', 'ปกติ'),
('O05', 'ปกติ'),
('O06', 'ปกติ'),
('O07', 'ปกติ'),
('O08', 'ปกติ'),
('O09', 'ปกติ'),
('O10', 'ปกติ'),
('O11', 'ปกติ'),
('O12', 'ปกติ'),
('O13', 'ปกติ'),
('O14', 'ปกติ'),
('O15', 'ปกติ'),
('O16', 'ปกติ'),
('O17', 'ปกติ'),
('O18', 'ปกติ'),
('O19', 'ปกติ'),
('O20', 'ปกติ'),
('O21', 'ปกติ'),
('O22', 'ปกติ'),
('O23', 'ปกติ'),
('O24', 'ปกติ'),
('O25', 'ปกติ'),
('P01', 'ปกติ'),
('P02', 'ปกติ'),
('P03', 'ปกติ'),
('P04', 'ปกติ'),
('P05', 'ปกติ'),
('P06', 'ปกติ'),
('P07', 'ปกติ'),
('P08', 'ปกติ'),
('P09', 'ปกติ'),
('P10', 'ปกติ'),
('P11', 'ปกติ'),
('P12', 'ปกติ'),
('P13', 'ปกติ'),
('P14', 'ปกติ'),
('P15', 'ปกติ'),
('P16', 'ปกติ'),
('P17', 'ปกติ'),
('P18', 'ปกติ'),
('P19', 'ปกติ'),
('P20', 'ปกติ'),
('P21', 'ปกติ'),
('P22', 'ปกติ'),
('P23', 'ปกติ'),
('P24', 'ปกติ'),
('P25', 'ปกติ'),
('Q01', 'ปกติ'),
('Q02', 'ปกติ'),
('Q03', 'ปกติ'),
('Q04', 'ปกติ'),
('Q05', 'ปกติ'),
('Q06', 'ปกติ'),
('Q07', 'ปกติ'),
('Q08', 'ปกติ'),
('Q09', 'ปกติ'),
('Q10', 'ปกติ'),
('Q11', 'ปกติ'),
('Q12', 'ปกติ'),
('Q13', 'ปกติ'),
('Q14', 'ปกติ'),
('Q15', 'ปกติ'),
('Q16', 'ปกติ'),
('Q17', 'ปกติ'),
('Q18', 'ปกติ'),
('Q19', 'ปกติ'),
('Q20', 'ปกติ'),
('Q21', 'ปกติ'),
('Q22', 'ปกติ'),
('Q23', 'ปกติ'),
('Q24', 'ปกติ'),
('Q25', 'ปกติ'),
('R01', 'ปกติ'),
('R02', 'ปกติ'),
('R03', 'ปกติ'),
('R04', 'ปกติ'),
('R05', 'ปกติ'),
('R06', 'ปกติ'),
('R07', 'ปกติ'),
('R08', 'ปกติ'),
('R09', 'ปกติ'),
('R10', 'ปกติ'),
('R11', 'ปกติ'),
('R12', 'ปกติ'),
('R13', 'ปกติ'),
('R14', 'ปกติ'),
('R15', 'ปกติ'),
('R16', 'ปกติ'),
('R17', 'ปกติ'),
('R18', 'ปกติ'),
('R19', 'ปกติ'),
('R20', 'ปกติ'),
('R21', 'ปกติ'),
('R22', 'ปกติ'),
('R23', 'ปกติ'),
('R24', 'ปกติ'),
('R25', 'ปกติ'),
('S01', 'ปกติ'),
('S02', 'ปกติ'),
('S03', 'ปกติ'),
('S04', 'ปกติ'),
('S05', 'ปกติ'),
('S06', 'ปกติ'),
('S07', 'ปกติ'),
('S08', 'ปกติ'),
('S09', 'ปกติ'),
('S10', 'ปกติ'),
('S11', 'ปกติ'),
('S12', 'ปกติ'),
('S13', 'ปกติ'),
('S14', 'ปกติ'),
('S15', 'ปกติ'),
('S16', 'ปกติ'),
('S17', 'ปกติ'),
('S18', 'ปกติ'),
('S19', 'ปกติ'),
('S20', 'ปกติ'),
('S21', 'ปกติ'),
('S22', 'ปกติ'),
('S23', 'ปกติ'),
('S24', 'ปกติ'),
('S25', 'ปกติ'),
('T01', 'ปกติ'),
('T02', 'ปกติ'),
('T03', 'ปกติ'),
('T04', 'ปกติ'),
('T05', 'ปกติ'),
('T06', 'ปกติ'),
('T07', 'ปกติ'),
('T08', 'ปกติ'),
('T09', 'ปกติ'),
('T10', 'ปกติ'),
('T11', 'ปกติ'),
('T12', 'ปกติ'),
('T13', 'ปกติ'),
('T14', 'ปกติ'),
('T15', 'ปกติ'),
('T16', 'ปกติ'),
('T17', 'ปกติ'),
('T18', 'ปกติ'),
('T19', 'ปกติ'),
('T20', 'ปกติ'),
('T21', 'ปกติ'),
('T22', 'ปกติ'),
('T23', 'ปกติ'),
('T24', 'ปกติ'),
('T25', 'ปกติ');

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
-- Dumping data for table `status`
--

INSERT INTO `status` (`Status_id`, `Status_Name`, `Admin_id`) VALUES
('S001', 'ยืนยันคำสั่งซื้อรอการชำระเงิน', 'A01'),
('S002', 'ชำระเงินสำเร็จรอการตรวจสอบ', 'A01'),
('S003', 'ชำระเงินเสร็จสมบูรณ์', 'A01'),
('S004', 'ยกเลิกคำสั่งซื้อเนื่องจากไม่ชำระเงินตามกำหนด ยกเลิกโดยระบบ', 'A01'),
('S005', 'ยกเลิกคำสั่งซื้อเนื่องจากชำระเงินไม่ถูกต้อง ยกเลิกโดยผู้ดูแลระบบ', 'A01');

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
