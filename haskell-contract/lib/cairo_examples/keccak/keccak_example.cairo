%builtins output range_check bitwise

from keccak import finalize_keccak, keccak
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin

func main{output_ptr : felt*, range_check_ptr, bitwise_ptr : BitwiseBuiltin*}():
    alloc_locals
    local bitwise_ptr_start : BitwiseBuiltin* = bitwise_ptr
    let (local keccak_ptr : felt*) = alloc()
    let keccak_ptr_start = keccak_ptr

    # Compute keccak of "Hello world!".
    # Note that keccak gets little endian values, and short-string literals in Cairo are big endian,
    # so we reverse the letters.
    let (local input : felt*) = alloc()
    assert input[0] = 'ow olleH'
    assert input[1] = '!dlr'
    let (output) = keccak{keccak_ptr=keccak_ptr}(input, 12)
    %{
        input_str = 'Hello world!'
        output = ''.join(v.to_bytes(8, 'little').hex() for v in memory.get_range(ids.output, 4))
        print(f'Keccak of "{input_str}": {output}')
        from web3 import Web3
        assert '0x' + output == Web3.keccak(text=input_str).hex()
    %}
    assert output_ptr[0] = output[0]
    assert output_ptr[1] = output[1]
    assert output_ptr[2] = output[2]
    assert output_ptr[3] = output[3]
    let output_ptr = output_ptr + 4

    # Compute keccak of a short random string: "uzlbpiah".
    let (local input : felt*) = alloc()
    assert input[0] = 'haipblzu'
    let (output) = keccak{keccak_ptr=keccak_ptr}(input, 8)
    %{
        input_str = 'uzlbpiah'
        output = ''.join(v.to_bytes(8, 'little').hex() for v in memory.get_range(ids.output, 4))
        print(f'Keccak of "{input_str}": {output}')
        assert '0x' + output == Web3.keccak(text=input_str).hex()
    %}
    assert output_ptr[0] = output[0]
    assert output_ptr[1] = output[1]
    assert output_ptr[2] = output[2]
    assert output_ptr[3] = output[3]
    let output_ptr = output_ptr + 4

    # Compute keccak of a long random string:
    #   x = "uzlbpiahgabzsvmfeixnkgckllvydhrawqlxblbwaiesgdyaonwcttdjelybogdyruqjjeca" +
    #       "xyzkbtgxmflkrzihjrmorulgffzqceebemlhjdhgzhamobnesgomqsy"
    let (local input : felt*) = alloc()
    assert input[0] = 'haipblzu'
    assert input[1] = 'fmvszbag'
    assert input[2] = 'kcgknxie'
    assert input[3] = 'arhdyvll'
    assert input[4] = 'wblbxlqw'
    assert input[5] = 'aydgseia'
    assert input[6] = 'jdttcwno'
    assert input[7] = 'ydgobyle'
    assert input[8] = 'acejjqur'
    assert input[9] = 'xgtbkzyx'
    assert input[10] = 'hizrklfm'
    assert input[11] = 'gluromrj'
    assert input[12] = 'beecqzff'
    assert input[13] = 'ghdjhlme'
    assert input[14] = 'enbomahz'
    assert input[15] = 'ysqmogs'
    let (output) = keccak{keccak_ptr=keccak_ptr}(input, 127)
    %{
        input_str = (
            'uzlbpiahgabzsvmfeixnkgckllvydhrawqlxblbwaiesgdyaonwcttdjelybogdyruqjjeca' +
            'xyzkbtgxmflkrzihjrmorulgffzqceebemlhjdhgzhamobnesgomqsy')
        output = ''.join(v.to_bytes(8, 'little').hex() for v in memory.get_range(ids.output, 4))
        print(f'Keccak of "{input_str}": {output}')
        assert '0x' + output == Web3.keccak(text=input_str).hex()
    %}
    assert output_ptr[0] = output[0]
    assert output_ptr[1] = output[1]
    assert output_ptr[2] = output[2]
    assert output_ptr[3] = output[3]
    let output_ptr = output_ptr + 4

    finalize_keccak(keccak_ptr_start=keccak_ptr_start, keccak_ptr_end=keccak_ptr)

    %{
        # Print the number of used bitwise builtin instances.
        bitwise_start = ids.bitwise_ptr_start.address_
        print('Bitwise usage:', (ids.bitwise_ptr.address_ - bitwise_start) / 5)
    %}

    return ()
end
