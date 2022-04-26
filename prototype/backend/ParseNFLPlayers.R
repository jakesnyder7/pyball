#' ParseNFLPlayers.R
#' 
#' Functions to return data on players and positions to the
#' REST API in django. All data is returned in JSON format.
#' 
#' @author Marion Geary
#' March 22, 2022

defaultW <- getOption("warn")
options(warn = -1)

options(nflreadr.verbose = FALSE)
library(nflverse)
library(tidyverse)


#setwd("/Users/Marion/Desktop/csci335/pyball/prototype/backend")

load('APIData.Rdata')

all_data <- all_data %>% add_column(name = str_to_lower(str_remove_all(all_data$full_name, "[.]")))

all_data %>%
  add_column(name_json = str_remove_all(all_data$full_name, "[.]")) %>%
  select(name_json) %>%
  distinct() %>%
  jsonlite::toJSON()


#' Get the data about a specified player
#'
#' @param player_name_query The name of the desired player
#' @return Data on the player formatted as a JSON
get_player_data <- function(player_name_query) {
  query <- str_remove_all(str_to_lower(player_name_query), "[.]")
  gsis <- all_data %>% filter(name == query) %>% select(gsis_id) %>% slice(1) %>% pluck(1)
  player_large_data <- all_data %>% filter(name == query) %>% filter(gsis_id == gsis)
  non_unique <- player_large_data %>%
    summarise_all(n_distinct) %>%
    select_if(. != 1)
  non_unique <- non_unique
  non_unique_cols <- colnames(non_unique)
  player_large_data_1 <- player_large_data %>% select(-non_unique_cols) %>% distinct()
  player_large_data_n <- player_large_data %>% select(non_unique_cols)
  full_player_data <- c(player_large_data_1, player_large_data_n)
  player_json <- jsonlite::toJSON(full_player_data, pretty = TRUE)
  return(player_json)
}

#' Get data on all players in a specified position
#'
#' @param position_query The official abbreviation of the position
#' @return Data on all players in the specified position formatted as a JSON
get_position_players <- function(position_query) {
  position_query <- str_to_lower(position_query)
  data_name <- paste0(position_query, "_data")
  tryCatch(
    expr = {
      return(get(data_name))
    },
    error = function(e){ 
      return("Enter a valid position name")
    },
    warning = function(w){ 
      return("Enter a valid position name")
    }
  )
}
