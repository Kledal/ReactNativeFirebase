import React, {PropTypes, Component} from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import {AvatarHeader, LikeBtn, Divider} from 'react-native-uikit';

import ItemText from '../components/ItemText';

export default class Post extends Component {
  render() {
    const {post, likePost} = this.props;
    const {width} = Dimensions.get('window');

    return (
      <View>
        <AvatarHeader
          src={post.creatorPhoto}
          heading={post.creatorName}
          timestamp={post.createdAt}
          circle={true}
          backgroundColor={'#fff'}
          height={40}
          gutter={10}
        />
        <ScrollView
          horizontal={true}
          decelerationRate={'fast'}
          directionalLockEnabled={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={true}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={200}
          height={300}
        >
          {post.itemPhotos && post.itemPhotos.map((photo, index) => {
            return (<Image
              key={index}
              style={{marginTop: 15, resizeMode: 'cover', width: width}}
              source={{uri: photo}}
              height={300}
            />);
          })}
        </ScrollView>
        <View style={{paddingTop: 5, paddingHorizontal: 10, backgroundColor: '#fff'}}>
          <LikeBtn
            active={true}
            likes={post.likeCount}
            onPress={() => likePost(post) }
          />
          <ItemText
            text={post.title}
            onPress={() => console.log('link to profile')}
          />
          <Divider color={'#eee'}/>
        </View>
      </View>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired
};
