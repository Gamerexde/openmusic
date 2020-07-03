-- Imports
local component = require("component")
local internet = require("internet")
local radio = component.openfm_radio
local json = require("json")
local inspect = require("inspect")
local io = require("io")

-- Configurable
local url = "http://localhost:3000"

local response = internet.request(url)

local count = 0
local httpbody = ""
local result = {}
local lua_body = ""

function main()
  httpFetch()
  parseJSONToArray()
  songsToPlay()
  setRadio(url, input())
end

function httpFetch()
  for chunk in response do
    httpbody = httpbody .. chunk
  end
end

function parseJSONToArray()
  lua_body = json:decode(httpbody)
  while true do
    if inspect(lua_body[tostring(count)]) ~= "nil" then
      table.insert(result, lua_body[tostring(count)])
      count = count + 1
    else
      break
    end
  end
end

function songsToPlay()
  print("What song do you want to play?")
    for songs = 1, #result do
      print("-- " .. tostring(songs) .. " -- [" .. result[songs] .. "]")
    end    
end

function input()
  while true do
    io = io.read()
    
    if tonumber(io) == nil then
      print("That's not a number ._.")
    else
      return tonumber(io)
    end
  end
end

function setRadio(url, index)
  print("Playing " .. result[tonumber(index)] .. ".")
  radio.stop()
  radio.setURL(url .. "/music/" .. result[tonumber(index)])
  radio.start()
end

main()