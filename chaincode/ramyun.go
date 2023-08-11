/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Ramyun struct {
	Name    string `json:"name"`
	Price   int    `json:"price"`
	Amount  int    `json:"amount"`
	Seller  string `json:"seller"`
	Company string `json:"company"`
}

type QueryResult struct {
	Key  string `json:"Key"`
	Data *Ramyun
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	ramyuns := []Ramyun{
		Ramyun{Name: "Shin Ramyun", Price: 625, Amount: 262, Seller: "11Bunga", Company: "Nongshim"},
		Ramyun{Name: "Jjapaghetti", Price: 737, Amount: 482, Seller: "Gmarket", Company: "Nongshim"},
		Ramyun{Name: "Jin Ramen", Price: 494, Amount: 417, Seller: "Gmarket", Company: "Ottogi"},
		Ramyun{Name: "Samyang Ramen", Price: 517, Amount: 261, Seller: "Auction.", Company: "Samyang"},
		Ramyun{Name: "Paldo Bibimmyeon", Price: 601, Amount: 634, Seller: "11Bunga", Company: "Paldo"},
		Ramyun{Name: "Neoguri", Price: 730, Amount: 220, Seller: "Auction.", Company: "Nongshim"},
		Ramyun{Name: "Buldak Bokkeum Myun", Price: 771, Amount: 251, Seller: "TMON", Company: "Samyang"},
		Ramyun{Name: "Sarigomtang Myun", Price: 764, Amount: 352, Seller: "Gmarket", Company: "Nongshim"},
		Ramyun{Name: "Snack Ramen", Price: 392, Amount: 710, Seller: "TMON", Company: "Ottogi"},
		Ramyun{Name: "Ansungtangmyun", Price: 523, Amount: 544, Seller: "WEMAKEPRICE", Company: "Nongshim"},
		Ramyun{Name: "Jin Jjambbong", Price: 1052, Amount: 768, Seller: "WEMAKEPRICE", Company: "Ottugi"},
	}

	for _, ramyun := range ramyuns {
		bytes, _ := json.Marshal(ramyun)
		err := ctx.GetStub().PutState(ramyun.Name, bytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}

	return nil
}

func (s *SmartContract) CreateRamyun(ctx contractapi.TransactionContextInterface, name string, price int, amount int, seller string, company string) error {
	ramyun := Ramyun{Name: name, Price: price, Amount: amount, Seller: seller, Company: company}
	bytes, _ := json.Marshal(ramyun)
	return ctx.GetStub().PutState(ramyun.Name, bytes)
}

func (s *SmartContract) QueryRamyunByName(ctx contractapi.TransactionContextInterface, name string) ([]QueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		ramyun := new(Ramyun)
		_ = json.Unmarshal(queryResponse.Value, ramyun)
		if !strings.Contains(ramyun.Name, name) {
			continue
		}

		queryResult := QueryResult{queryResponse.Key, ramyun}
		results = append(results, queryResult)
	}

	return results, nil
}

func (s *SmartContract) QueryRamyunByCompany(ctx contractapi.TransactionContextInterface, company string) ([]QueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		ramyun := new(Ramyun)
		_ = json.Unmarshal(queryResponse.Value, ramyun)
		if !strings.Contains(ramyun.Company, company) {
			continue
		}

		queryResult := QueryResult{queryResponse.Key, ramyun}
		results = append(results, queryResult)
	}

	return results, nil
}

func (s *SmartContract) QueryRamyunBySeller(ctx contractapi.TransactionContextInterface, seller string) ([]QueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		ramyun := new(Ramyun)
		_ = json.Unmarshal(queryResponse.Value, ramyun)
		if !strings.Contains(ramyun.Seller, seller) {
			continue
		}

		queryResult := QueryResult{queryResponse.Key, ramyun}
		results = append(results, queryResult)
	}

	return results, nil
}

func (s *SmartContract) QueryRamyunByPriceBetween(ctx contractapi.TransactionContextInterface, minPriceInclude int, maxPriceExclude int) ([]QueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		ramyun := new(Ramyun)
		_ = json.Unmarshal(queryResponse.Value, ramyun)
		if ramyun.Price < minPriceInclude || ramyun.Price >= maxPriceExclude {
			continue
		}

		queryResult := QueryResult{queryResponse.Key, ramyun}
		results = append(results, queryResult)
	}

	return results, nil
}

type PriceQueryResult struct {
	Name        string `json:"name"`
	PerPrice    int    `json:"per_price"`
	TotalAmount int    `json:"total_amount"`
	TotalPrice  int    `json:"total_price"`
	TotalChange int    `json:"total_change"`
	Seller      string `json:"seller"`
	Company     string `json:"company"`
}

func (s *SmartContract) QueryRamyunCanBuyByPrice(ctx contractapi.TransactionContextInterface, availablePrice int) ([]PriceQueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []PriceQueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		ramyun := new(Ramyun)
		_ = json.Unmarshal(queryResponse.Value, ramyun)
		if ramyun.Price > availablePrice {
			continue
		}

		availableCount := min(availablePrice/ramyun.Price, ramyun.Amount)
		totalPrice := ramyun.Price * availableCount

		queryResult := PriceQueryResult{
			Name:        ramyun.Name,
			PerPrice:    ramyun.Price,
			TotalAmount: availableCount,
			TotalPrice:  totalPrice,
			TotalChange: availablePrice - totalPrice,
			Seller:      ramyun.Seller,
			Company:     ramyun.Company,
		}
		results = append(results, queryResult)
	}

	return results, nil
}

func (s *SmartContract) QueryAllRamyuns(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		ramyun := new(Ramyun)
		_ = json.Unmarshal(queryResponse.Value, ramyun)

		queryResult := QueryResult{queryResponse.Key, ramyun}
		results = append(results, queryResult)
	}

	return results, nil
}

func (s *SmartContract) ChangeRamyunSeller(ctx contractapi.TransactionContextInterface, name string, seller string, newAmount int) error {
	b, err := ctx.GetStub().GetState(name)

	if err != nil {
		return err
	}

	ramyun := new(Ramyun)
	_ = json.Unmarshal(b, ramyun)

	ramyun.Seller = seller
	ramyun.Amount = newAmount

	bytes, _ := json.Marshal(ramyun)

	return ctx.GetStub().PutState(name, bytes)
}

func (s *SmartContract) ChangeRamyunPrice(ctx contractapi.TransactionContextInterface, name string, newPrice int) error {
	b, err := ctx.GetStub().GetState(name)

	if err != nil {
		return err
	}

	ramyun := new(Ramyun)
	_ = json.Unmarshal(b, ramyun)

	ramyun.Price = newPrice

	bytes, _ := json.Marshal(ramyun)

	return ctx.GetStub().PutState(name, bytes)
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}
