import React from 'react';
import { FC, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMutation } from '@apollo/client';
import GameCardInfo from '../GameCardInfo/GameCardInfo';
import updateIsFavoritedById from '../../GraphQL/Mutations/updateIsFavoritedById';
import './GameCard.css';


// props which the GameCard use
interface gameCardProps {
  gameId: string;
  gameName: string;
  publisher: string;
  platform: string;
  genre: string;
  isFavorited: boolean;
}

/**
* A functional component that displays the information in Card-components
* @param gameCardProps interface
* @returns a component displaying the information in Card-components
*/
const GameCard: FC<gameCardProps> = ({ gameId, gameName, publisher, platform, genre, isFavorited }) => {

  // variables for the mutation
  const info = {
    "where": {
      "gameId": gameId
    },
    "update": {
      "isFavorited": !isFavorited
    }
  }

  // functions to keep track of the state of favorites
  const [isFavoriteState, setIsFavoriteState] = useState<boolean>(isFavorited)
  const [heartColor, setHeartColor] = useState<string>(isFavorited ? "#ff3399" : "disabled");
  const [toggleIsFavorited] = useMutation(updateIsFavoritedById, { variables: info });

  // function which makes it visible for the user that the game is favorited
  useEffect(() => {
    setHeartColor(isFavoriteState ? "#ff3399" : "disabled");
  }, [isFavoriteState]);

  // function which handles the favorization
  const handleToggleFavorite = (e: React.MouseEvent<HTMLElement>) => {
    toggleIsFavorited();
    setIsFavoriteState(!isFavoriteState);
  }

  return (
    <Card
      sx={{
        width: 290,
        minHeight: 390,
        maxHeight: 500,
      }}
      id={gameId}
    >
      {/* Header with the title (which is big due to some long titles) */}
      <CardHeader
        title={gameName}
        subheader={publisher}
        sx={{
          minHeight: 250,
        }}
      />
      {/* Div which will be replaced with image as the development progresses */}
      <div className='cardColorBox'>
        GameImage
      </div>

      {/* Icons which will make the favorization happen and show more information */}
      <CardActions disableSpacing>
        <IconButton
          onClick={handleToggleFavorite}
          aria-label="add to favorites"
          data-testid="favoriteIcon"
        >
          <FavoriteIcon sx={{ color: heartColor }} />
        </IconButton>
        <GameCardInfo
          gameNameInfo={gameName}
          publisherInfo={publisher}
          platformInfo={platform}
          genreInfo={genre}
        />
      </CardActions>
    </Card>
  );
}

export default GameCard;

