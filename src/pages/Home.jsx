import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import { HomePodcast } from '../components';
import { Buttons } from '../components/UI';
import { AiOutlineHome } from 'react-icons/ai';
import { AiOutlineSearch } from 'react-icons/ai';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
} from 'react-icons/fc';
import {
  setHomePageDisplayedPodcasts,
  setSorting,
  setSearchInput,
} from '../globalState/reducers/podcastsReducer';
const Main = styled.main`
  display: flex;
`;
const Menu = styled.div`
  display: flex;
  gap: 2rem;
`;
const Aside = styled.aside`
  display: flex;
  justify-content: space-between;
`;
const MainRight = styled.section`
  flex-grow: 2;
  border: 1px solid red;
`;
const PodcastsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const LogInButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const SpecificGenre = styled.div`
  background-color: orange;
`;
const Home = () => {
  const {
    allPodcasts,
    searchInput,
    isLoading,
    homePageDisplayedPodcasts,
    sorting,
    isLoggedIn,
  } = useSelector((state) => state.podcastsReducer);
  const dispatch = useDispatch();
  const backToHome = () => {
    dispatch(setHomePageDisplayedPodcasts(allPodcasts));
  };

  const sortAlphabetically = (e, podcastArray) => {
    const value = e.target.value;
    const lowercase = podcastArray.map((item) => {
      return { ...item, title: item.title.toLowerCase() };
    });

    let sortedLowercase = lowercase.sort((a, b) => {
      if (value === 'ZA') {
        dispatch(setSorting('ZA'));
        return a.title > b.title ? -1 : 1;
      }
      if (value === 'AZ') {
        dispatch(setSorting('AZ'));
        return a.title > b.title ? 1 : -1;
      }
      if (value === 'ascendingDate') {
        dispatch(setSorting('ascendingDate'));
        return a.updated > b.updated ? 1 : -1;
      }
      if (value === 'decendingDate') {
        dispatch(setSorting('decendingDate'));
        return a.updated > b.updated ? -1 : 1;
      }
    });
    if (value === 'unsorted') {
      dispatch(setSorting('unsorted'));
      sortedLowercase = allPodcasts;
    }
    dispatch(setHomePageDisplayedPodcasts(sortedLowercase));
    return sortedLowercase;
  };
  const searchPodcasts = (e) => {
    e.preventDefault();
    const value = e.target.value.toLowerCase();
    console.log(value);
    dispatch(setSearchInput(value));
    const filteredPodcasts = allPodcasts.filter((item) => {
      return item.title.toLowerCase().includes(value);
    });
    dispatch(setHomePageDisplayedPodcasts(filteredPodcasts));
  };
  return (
    <Main>
      <MainRight>
        <Aside>
          <Menu>
            <p>
              <AiOutlineHome className="icon-color" onClick={backToHome} />
            </p>
            <p>
              <AiOutlineSearch className="icon-color" />
            </p>
            <p>
              <select
                name="sorting"
                id="sorting"
                value={sorting}
                onChange={(e) =>
                  sortAlphabetically(e, homePageDisplayedPodcasts)
                }
              >
                <option value="unsorted"> -- unsorted --</option>
                <option value="AZ">a-z</option>
                <option value="ZA">z-a</option>
                <option value="decendingDate">newest-oldest</option>
                <option value="ascendingDate">oldest-newest</option>
              </select>
            </p>
            <form action="" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="searchInput"
                id="search"
                onChange={(e) => searchPodcasts(e)}
                value={searchInput}
                placeholder="Search"
              />
            </form>
          </Menu>
          <LogInButtons>
            {!isLoggedIn && (
              <Link to="/signup">
                <Buttons $backgroundColor={'red'}>Signup</Buttons>
              </Link>
            )}
            <Link to="/login">
              <Buttons $backgroundColor={'red'}>
                {!isLoggedIn ? 'Login' : 'Logout'}
              </Buttons>
            </Link>
          </LogInButtons>
        </Aside>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <PodcastsContainer>
            {homePageDisplayedPodcasts.map((item, index) => {
              const { description, image, id, title, genres } = item;

              return <HomePodcast key={id} item={item} />;
            })}
          </PodcastsContainer>
        )}
      </MainRight>
    </Main>
  );
};

export default Home;
