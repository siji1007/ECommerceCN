-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2024 at 06:51 PM
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
-- Database: `tourism_ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `session_cookies_unauth`
--

CREATE TABLE `session_cookies_unauth` (
  `s_unauth_id` int(11) NOT NULL,
  `unauth_cookie` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_cookies_unauth`
--

INSERT INTO `session_cookies_unauth` (`s_unauth_id`, `unauth_cookie`, `created_at`) VALUES
(1, '9fzapp8ekcim3akweme', '2024-11-09 19:48:43');

-- --------------------------------------------------------

--
-- Table structure for table `testing_table`
--

CREATE TABLE `testing_table` (
  `Fname` varchar(11) NOT NULL,
  `Lname` varchar(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `testing_table`
--

INSERT INTO `testing_table` (`Fname`, `Lname`, `id`) VALUES
('Christian', 'Ibanez', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `session_cookies_unauth`
--
ALTER TABLE `session_cookies_unauth`
  ADD PRIMARY KEY (`s_unauth_id`);

--
-- Indexes for table `testing_table`
--
ALTER TABLE `testing_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `session_cookies_unauth`
--
ALTER TABLE `session_cookies_unauth`
  MODIFY `s_unauth_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `testing_table`
--
ALTER TABLE `testing_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
