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
        BigInt3(0x14c422dcaf5b155f3d952a,0x13d236b0837506a7db3953,0x19adbf051b7f566e8cba9),
        BigInt3(0xdbfea698128928378b45,0xb563e98b8df5b3ab2267e,0xc41a75ef3967c29505987))
    let r = BigInt3(0xad2fe7abda8a321de87fa,0x34cf31043ba3cc20c81398,0x5b54753d12828190cc5d4)
    let s = BigInt3(0x1bfadacff53508a445a3d8,0x1f3b7377788a5741c8e5fc,0x866d08f80c2e3c14f8d4c)
    let msg_hash = BigInt3(0x4d79206d657373616765,0,0)
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
