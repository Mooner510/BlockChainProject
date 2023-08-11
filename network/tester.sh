#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error


#!/bin/bash
## PATH config
export PATH=${HOME}/fabric-samples/bin:$PATH
export BasicPATH=${HOME}/fabric-samples/test-network
export FABRIC_CFG_PATH=${HOME}/fabric-samples/config
## Peer config
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${BasicPATH}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${BasicPATH}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

## connection info config
ORDERER_CA=${BasicPATH}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
PEER_CONN_PARMS="--peerAddresses localhost:7051 --tlsRootCertFiles ${BasicPATH}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${BasicPATH}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

## TEST1 : Invoking the chaincode
echo "TEST1 : Invoking the chaincode"
set -x
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n ramyun $PEER_CONN_PARMS -c '{"function":"InitLedger","Args":[]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 1

## TEST2
printf "\n\n\n======================================================================================================================\n\n\n"
echo "TEST2 : Query the chaincode"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryAllRamyuns","Args":[]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

sleep 1

## TEST3
printf "\n\n\n======================================================================================================================\n\n\n"
echo "TEST3 : Create New Ramyun"
set -x
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n ramyun $PEER_CONN_PARMS -c '{"function":"CreateRamyun","Args":["Jin Jjambbong", "1052", "768", "WEMAKEPRICE", "Ottugi"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

sleep 3

## TEST4
printf "\n\n\n======================================================================================================================\n\n\n"
echo "TEST4 : Query Ramyun By Name"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByName","Args":["Jin Jjambbong"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByName","Args":["Shin Ramyun"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByName","Args":["Paldo Bibimmyeon"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByName","Args":["Snack Ramen"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

sleep 1

## TEST5
printf "\n\n\n======================================================================================================================\n\n\n"
echo "TEST5 : Query Ramyun by Company"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByCompany","Args":["Ottogi"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByCompany","Args":["Samyang"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByCompany","Args":["Nongshim"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

sleep 1


## TEST6
printf "\n\n\n======================================================================================================================\n\n\n"
echo "TEST6 : Query Ramyun By Price Between"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByPriceBetween","Args":["400", "700"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByPriceBetween","Args":["350", "900"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunByPriceBetween","Args":["800", "1200"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

sleep 1



## TEST7
printf "\n\n\n======================================================================================================================\n\n\n"
echo "TEST7 : Query Ramyun Which Can Buy With Price"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunCanBuyByPrice","Args":["5000"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunCanBuyByPrice","Args":["600"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

printf "\n\n"
set -x
peer chaincode query -C mychannel -n ramyun -c '{"function":"QueryRamyunCanBuyByPrice","Args":["120000"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
