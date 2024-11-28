<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { saveAvatarApi,authApi } from '@/api/login'
import { useUserStore } from '@/stores/user'
import { ref, unref } from 'vue'
import UploadAvatar from './components/UploadAvatar.vue'
import { ElDivider, ElImage, ElTag, ElTabPane, ElTabs, ElButton, ElMessage } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { type UserInfo } from '@/api/login/types'
import defaultAvatar from '@/assets/imgs/avatar.jpg'

const userStore = useUserStore()

const userInfo = ref<UserInfo>()
const file_url = ref(userStore.getAvatarUrl)

const getUserInfo = async ()=>{
  const res = await authApi()
  userInfo.value = res.data
  file_url.value = userInfo.value?.file_url
  userStore.setUserInfo(res.data)
}


getUserInfo()



const activeName = ref('first')

const dialogVisible = ref(false)

const uploadAvatarRef = ref<ComponentRef<typeof UploadAvatar>>()

const avatarLoading = ref(false)

const saveAvatar = async () => {
  try {
    avatarLoading.value = true
    const base64 = unref(uploadAvatarRef)?.getBase64()
    // 这里可以调用修改头像接口
    saveAvatarApi({base64})
    getUserInfo()
    ElMessage.success('修改成功')
    dialogVisible.value = false
  } catch (error) {
    console.log(error)
  } finally {
    avatarLoading.value = false
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap title="个人信息" class="w-500px">
      <div class="flex justify-center items-center">
        <div
          class="avatar w-[150px] h-[150px] relative cursor-pointer"
          @click="dialogVisible = true"
        >
          <ElImage
            class="w-[150px] h-[150px] rounded-full"
            :src="file_url"
            fit="fill"
          />
        </div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>ID：</div>
        <div>{{ userInfo?.id }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>昵称：</div>
        <div>{{ userInfo?.username }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>用户邮箱：</div>
        <div>{{ userInfo?.email ?? '-' }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>所属角色：</div>
        <div>
          <template v-if="userInfo?.role_id">
            <ElTag class="ml-2 mb-w">{{ userInfo?.role_id }}</ElTag>
          </template>
          <template v-else>-</template>
        </div>
      </div>
      <ElDivider />
    </ContentWrap>
    <ContentWrap title="基本资料" class="flex-[3] ml-20px">
      <ElTabs v-model="activeName">
        <ElTabPane label="基本信息" name="first">
          <!-- <EditInfo :user-info="userInfo" /> -->
        </ElTabPane>
        <ElTabPane label="修改密码" name="second">
          <!-- <EditPassword /> -->
        </ElTabPane>
      </ElTabs>
    </ContentWrap>
  </div>

  <Dialog v-model="dialogVisible" title="修改头像" width="800px">
    <UploadAvatar ref="uploadAvatarRef" :url="defaultAvatar" />

    <template #footer>
      <ElButton type="primary" :loading="avatarLoading" @click="saveAvatar"> 保存 </ElButton>
      <ElButton @click="dialogVisible = false">关闭</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.avatar {
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 50px;
    color: #fff;
    background-color: rgb(0 0 0 / 40%);
    border-radius: 50%;
    content: '+';
    opacity: 0;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}
</style>