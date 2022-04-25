%lang starknet


from starkware.cairo.common.cairo_builtins import HashBuiltin, SignatureBuiltin
# from src.custom_library import (
# openzeppelin.account.library
from src.custom_library import (
    AccountCallArray,
    Account_execute,
    Account_get_nonce,
    Account_initializer,
    Account_get_public_key,
    Account_set_public_key,
    Account_is_valid_signature
)

from openzeppelin.introspection.ERC165 import ERC165_supports_interface 
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from p256_ec import EcPoint
from bigint import BigInt3

from p256 import verify_ecdsa
#
# Getters
#

@view
func get_nonce{
        syscall_ptr : felt*, 
        pedersen_ptr : HashBuiltin*,
        range_check_ptr, 
        ecdsa_ptr: SignatureBuiltin*,
        bitwise_ptr : BitwiseBuiltin*
    }() -> (res: felt):

    let public_key_pt = EcPoint(
        BigInt3(0xdff543a62da7d7017c42d,0x2c6ff711edd0bc0d915b4c,0x69030b9106fecc788677b),
        BigInt3(0x2f5c09843c026609c6b555,0x1938bbc9771b5221311892,0x8793a19494e67327b210e))
    let r = BigInt3(0x8e7922283582cd576455f,0xd9c2b6eea9c9da8bf568a,0xe70a0b2fe3e5d47b27beb)
    let s = BigInt3(0x11a09242061b97ce473d6,0x3ac7622c6090c984241f26,0x902e7372f7a819f86991c)
    let msg_hash = BigInt3(0x100377dbc4e7a6a133ec56,0x25c813f825413878bbec6a,0x44acf6b7e36c1342c2c58)
    verify_ecdsa(public_key_pt=public_key_pt, msg_hash=msg_hash, r=r, s=s)
    let (res) = Account_get_nonce()
    return (res=res)
end

@view
func supportsInterface{
        syscall_ptr: felt*, 
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    } (interfaceId: felt) -> (success: felt):
    let (success) = ERC165_supports_interface(interfaceId)
    return (success)
end

#
# Setters
#

#
# Constructor
#

@constructor
func constructor{
        syscall_ptr : felt*, 
        pedersen_ptr : HashBuiltin*,
        range_check_ptr
    }(public_key: EcPoint):
    Account_initializer(public_key)
    return ()
end

#
# Business logic
#

@external
func __execute__{
        syscall_ptr : felt*,
        pedersen_ptr : HashBuiltin*,
        range_check_ptr, 
        ecdsa_ptr: SignatureBuiltin*,
        bitwise_ptr : BitwiseBuiltin*
    }(
        call_array_len: felt,
        call_array: AccountCallArray*,
        calldata_len: felt,
        calldata: felt*,
        nonce: felt
    ) -> (response_len: felt, response: felt*):
    let (response_len, response) = Account_execute(
        call_array_len,
        call_array,
        calldata_len,
        calldata,
        nonce
    )
    return (response_len=response_len, response=response)
end
