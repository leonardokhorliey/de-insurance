// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20("MockUSDT", "MUSDM") {
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public {
        _burn(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function _beforeTokenTransfer(
        address, /*from*/
        address, /*to*/
        uint256 amount
    ) internal pure override {
        require(amount > 0, "ERC20Mock: amount 0");
    }
}
