import { useLocalStorage } from "react-use";

const useAccountContractAddress = () => {
  return useLocalStorage('account-contract-address');
}

export default useAccountContractAddress;