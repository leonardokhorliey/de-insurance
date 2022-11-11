// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface USDTInterface {


    function transfer(address _to, uint _value) external;

    function transferFrom(address _from, address _to, uint _value) external;

    function balanceOf(address who) external view returns (uint);

    function approve(address _spender, uint _value) external;

    // Forward ERC20 methods to upgraded contract if this one is deprecated
    function allowance(address _owner, address _spender) external view returns (uint remaining);

}